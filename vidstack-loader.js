const VIDSTACK_PLAYER_URL = "https://cdn.jsdelivr.net/npm/@vidstack/cdn@1.12.9/player.js";
const VIDSTACK_ICONS_URL = "https://cdn.jsdelivr.net/npm/media-icons@1.1.5/dist/cdn.js";

async function importPatchedVidstackModule() {
    const response = await fetch(VIDSTACK_PLAYER_URL);
    if (!response.ok) {
        throw new Error(`Gagal mengambil Vidstack ${VIDSTACK_PLAYER_URL}: ${response.status}`);
    }

    const source = await response.text();
    const patchedSource = source.replaceAll('"https://cdn.vidstack.io/icons"', `"${VIDSTACK_ICONS_URL}"`);
    const blobUrl = URL.createObjectURL(new Blob([patchedSource], { type: "application/javascript" }));

    try {
        return await import(blobUrl);
    } finally {
        URL.revokeObjectURL(blobUrl);
    }
}

window.vidstackReady = (async () => {
    const module = await importPatchedVidstackModule();
    await customElements.whenDefined("media-player");
    await customElements.whenDefined("media-provider");
    await customElements.whenDefined("media-video-layout");
    return module;
})();
