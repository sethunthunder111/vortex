console.log("Vortex Engine Initialized 🌀");

document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        console.log(`Searching for: ${query}`);
        // TODO: Implement search logic
        alert(`Searching for: ${query}`);
    }
});

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});
