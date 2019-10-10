/**
 * The event type object.
 * @typedef {Object} EventType
 * @property {number} id - the event type's unique ID
 * @property {string} name - the name of the event type
 * @property {number} lastModified - the date and time the event type was last modified, expressed in number of milliseconds since January 1, 1970 0:00:00.000 GMT
 * @property {string} [formatting] - the JSON representation of the object to apply the the rows of the events of this event type
 * @property {boolean} [hidden] - true if the event type shouldn't be shown on the home page, or event type management page
 */

/**
 * The event object.
 * @typedef {Object} EventObj
 * @property {number} id - the event's unique ID
 * @property {number} event - the ID of the event's event type
 * @property {number} datetime - the date and time the event occurred, expressed in number of milliseconds since January 1, 1970 0:00:00.000 GMT
 */

/** The object that stores local changes.
 * @typedef {Object} LocalChangesObj
 * @property {Array<EventObj>} [newEvents] - An array of new events to add.
 * @property {Array<number>} [deleteEvents] - An array of ID's of events to be deleted.
 * @property {Array<EventType} [eventTypes] - An array of modified event types to be updated.
 */

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
