function showTooltip(type, metric) {
    let tooltipText;
    if (type === 'bm') {
        tooltipText = bm_descriptions[metric];
    } else if (type === 'pm') {
        tooltipText = pm_descriptions[metric];
    } else {
        tooltipText = dm_descriptions[metric];
    }

    const tooltipElement = document.createElement('span');
    tooltipElement.className = 'tooltiptext';
    tooltipElement.innerHTML = tooltipText;

    const tooltipContainer = document.querySelector('.tooltip:hover');
    tooltipContainer.appendChild(tooltipElement);
}
