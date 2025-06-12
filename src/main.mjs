import Component from './components/Component.mjs';
import Form from './components/Form.mjs';
import Button from './components/Button.mjs';
import {MessageBox, MessageBoxButton} from './components/MessageBox.mjs';
import Modal from './components/Modal.mjs';
import Textbox from './components/Textbox.mjs';
import Numberbox from './components/Numberbox.mjs';
import Checkbox from './components/Checkbox.mjs';	
import Datepicker from './components/Datepicker.mjs';	
import Timepicker from './components/Timepicker.mjs';	
import Combobox from './components/Combobox.mjs';	
import Filebox from './components/Filebox.mjs';
import Dataloader from './components/DataLoader.mjs';	
import Gridview from './components/Gridview.mjs';	

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
	Gridview: Gridview
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









