import ICONS from './Icons.mjs'
import Component from "./Component.mjs"

const ATTR_ROWSELECTOR = 'rowselector'
const ATTR_AUTONUMBER = 'autonumber'
const ATTR_BINDING = 'binding'
const ATTR_SORTING = 'sorting'
const ATTR_FORMATTER = 'formatter'
const ATTR_TEXTALIGN = 'text-align'
const ATTR_ROWSELECTED = 'data-selected'
const ATTR_COLNAME = 'data-name'
const ATTR_VALUE = 'data-value'
const ATTR_ROWKEY = 'key'
const ATTR_ROWKEYVALUE = 'keyvalue'
const ATTR_ROWPROCESSING = 'data-rowprocessing'
const ATTR_MAINHEADROW = 'data-mainrowhead' // menandai row utama header (berisi contol sorting)
const ATTR_LINENUMBER = "linenumber"

const TYPE_ROWSELECTOR = 'rowselector'
const TYPE_AUTONUMBER = 'autonumber'
const TYPE_STANDARD = 'standard'

const cellClickEvent = (data) => { return new CustomEvent('cellclick', data) }
const cellDblClickEvent = (data) => { return new CustomEvent('celldblclick', data) }
const rowRenderEvent = (data) => { return new CustomEvent('rowrender', data) }
const rowRemovingEvent = (data) => { return new CustomEvent('rowremoving', data) }
const sortingEvent = (data) => { return new CustomEvent('sorting', data) }
const nextDataEvent = (data) => { return new CustomEvent('nextdata', data) }




