export const spriteSvg = (iconName, width = 28, height = 28) => `
<svg width="${width}" height="${height}">
    <use xlink:href="./assets/sprite.svg#${iconName}" />
</svg>
`; 
