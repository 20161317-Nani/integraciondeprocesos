const axios = require('axios');

// 1. Carga todas las claves desde .env y las divide en un array
const apiKeys = (process.env.YOUTUBE_API_KEYS || "").split(',').filter(Boolean);
let currentKeyIndex = 0; // Apunta a la clave que estamos usando actualmente

if (apiKeys.length === 0) {
    console.error("¡ERROR FATAL! No se encontraron YOUTUBE_API_KEYS en el archivo .env.");
}

// --- Funciones del Administrador de Claves ---

/**
 * Obtiene la clave de API que está actualmente en uso.
 */
const getKey = () => apiKeys[currentKeyIndex];

/**
 * Mueve el índice a la siguiente clave en la lista.
 * Si llega al final, vuelve a la primera (rotación).
 */
const rotateKey = () => {
    const oldKey = apiKeys[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    const newKey = apiKeys[currentKeyIndex];
    console.warn(`Cuota de API agotada para la clave [${oldKey.substring(0, 5)}...]. Rotando a la clave índice ${currentKeyIndex} [${newKey.substring(0, 5)}...].`);
};

/**
 * Esta es la función principal que usarás en tus rutas.
 * Intenta hacer una llamada a la API. Si falla por cuota (403),
 * rota la clave y reintenta UNA vez más.
 */
const callYouTubeAPI = async (url, params) => {
    if (apiKeys.length === 0) {
        throw new Error("No hay claves de API de YouTube configuradas.");
    }
    
    let currentKey = getKey();
    
    try {
        // --- Intento 1 ---
        return await axios.get(url, { params: { ...params, key: currentKey } });
    } catch (error) {
        // Si el error es 403 (Prohibido), asumimos que es por la cuota.
        if (error.response && error.response.status === 403) {
            console.log("Error 403 detectado. Rotando clave...");
            rotateKey(); // Cambia a la siguiente clave
            currentKey = getKey(); // Obtiene la nueva clave
            
            try {
                // --- Intento 2 ---
                console.log(`Reintentando con la clave índice: ${currentKeyIndex}`);
                return await axios.get(url, { params: { ...params, key: currentKey } });
            } catch (retryError) {
                // Si la segunda clave también falla, nos rendimos y lanzamos el error
                console.error("La clave de reintento también falló.");
                throw retryError;
            }
        }
        // Si es un error diferente (404, 500, etc.), simplemente lo lanzamos
        throw error;
    }
};

module.exports = { callYouTubeAPI };