/**
 * The props object for a Wizard Page.
 * @typedef {Object} WizardPageProps
 * @property {number} curStep - the index of the current step in the wizard
 * @property {string[]} steps - the array of steps in the wizard
 */

/**
 * The props object for a RowFormattingWizard Page.
 * @typedef {Object} FormatWizardPageProps
 * @property {number} curStep - the index of the current step in the wizard
 * @property {string[]} steps - the array of steps in the wizard
 * @property {FormattingObject} formatting - the formatting object that the wizard is building
 * @property {(updatedFormatting: FormattingObject) => void} setFormatting - the function to update the formatting object on the parent wizard
 */

/**
 * An object representing properties that can be set on a React JSX element
 * @typedef {Object} FormattingObject
 * @property {string} [className] - a string of space-separated class names
 * @property {Object} [style] - a string of space-separated class names
 * @property {string} [style.fontStyle] - the font style (e.g. 'italic')
 * @property {string} [style.textDecorationLine] - the line text decorations (e.g. 'underline')
 * @property {string} [style.fontWeight] - the font weight (e.g. 'bold')
 * @property {string} [style.color] - the color of the text
 * @property {string} [style.fontVariant] - the font variant (e.g. 'small-caps')
 * @property {string} [style.fontSize] - the size of the font
 * @property {string} [style.backgroundColor] - the background color
 * @property {string} [style.textAlign] - the alignment of the text (e.g. 'center')
 */
