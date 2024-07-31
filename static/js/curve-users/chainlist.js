const chainList = [
    "all",
    "ethereum",
    "fantom",
    "optimism",
    "polygon",
    "xdai",
    "fraxtal",
    "base",
    "arbitrum"
];

function createChainSelector(elementId, onChangeCallback) {
    const selectElement = document.getElementById(elementId);
    if (!selectElement) {
        console.error(`Element with id "${elementId}" not found`);
        return null;
    }

    chainList.forEach(chain => {
        const option = document.createElement('option');
        option.value = chain;
        option.textContent = chain.charAt(0).toUpperCase() + chain.slice(1);
        selectElement.appendChild(option);
    });

    selectElement.addEventListener('change', (event) => {
        onChangeCallback(event.target.value);
    });

    return selectElement.value;
}
window.createChainSelector = createChainSelector;