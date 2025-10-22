export async function translateText(text, from = "es", to = "en") {
  try {
    const response = await fetch("http://localhost:8080/translate.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source: from, target: to }),
    });

    const data = await response.json();
    if (data.translation) return data.translation;
    throw new Error(data.error || "Error al traducir");
  } catch (error) {
    console.error("Error en translateText:", error);
    throw error;
  }
}
