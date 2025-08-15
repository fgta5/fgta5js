import Component from './components/Component.mjs'
import Form from './components/Form.mjs'
import Button from './components/Button.mjs'
import {MessageBox, MessageBoxButton} from './components/MessageBox.mjs'
import Modal from './components/Modal.mjs'
import Textbox from './components/Textbox.mjs'
import Numberbox from './components/Numberbox.mjs'
import Checkbox from './components/Checkbox.mjs'
import Datepicker from './components/Datepicker.mjs'
import Timepicker from './components/Timepicker.mjs'
import Combobox from './components/Combobox.mjs'
import Filebox from './components/Filebox.mjs'
import Dataloader from './components/Dataloader.mjs'
import Gridview from './components/Gridview.mjs'
import AppManager from './components/AppManager.mjs'
import Application from './components/Application.mjs'
import ModuleData from './components/ModuleData.mjs'
import Section from './components/Section.mjs'
import SectionCarousell from './components/SectionCarousell.mjs'
import Icons from './components/Icons.mjs'
import ActionButton from './components/ActionButton.mjs'
import Dialog from './components/Dialog.mjs'
import ApiEndpoint from './components/ApiEndPoint.mjs'

import * as Validators from './components/Validators.mjs';




const fgta5 = {
	Component: Component,
	Form: Form,
	Button: Button,
	Textbox: Textbox,
	Numberbox: Numberbox,
	Checkbox: Checkbox,
	Datepicker: Datepicker,
	Timepicker: Timepicker,
	Combobox: Combobox,
	Filebox: Filebox,
	MessageBox: MessageBox,
	MessageBoxButton: MessageBoxButton,
	Modal: Modal,
	Dataloader: Dataloader,
	Gridview: Gridview,
	AppManager: AppManager,
	Application: Application,
	ModuleData: ModuleData,
	Section: Section,
	SectionCarousell: SectionCarousell,
	Icons: Icons,
	ActionButton: ActionButton,
	Dialog: Dialog,
	ApiEndpoint: ApiEndpoint
}


// install to window.$validators
if (window.$validators === undefined) {
	window.$validators = Validators;
} else {
	Object.assign(window.$validators, Validators);
}

// install to window.$fgta5
if (window.$fgta5===undefined || window.$fgta5===null) {
	window.$fgta5 =  fgta5
} else {
	Object.assign(window.$fgta5, fgta5)
}


export default fgta5;









