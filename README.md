# fgta5js



![](https://img.shields.io/github/stars/fgta5/fgta5js) ![](https://img.shields.io/github/forks/fgta5/fgta5js) ![](https://img.shields.io/github/tag/fgta5/fgta5js) ![](https://img.shields.io/github/release/fgta5/fgta5js) ![](https://img.shields.io/github/issues/fgta5/fgta5js)


This is a javascript library to simplify creating html form, by extending from standard form, by adding important features but still not exist in current html form specification, such as simplify detect value changes, accept value changes, reset value to last saved version, get json data, etc.

![](https://raw.githubusercontent.com/fgta5/fgta5js/main/images/ss-form-editmode.png)


### Installing
Put in HTML head
```html
<head>

	...

	<!-- fgta5js //-->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fgta5/fgta5js@v1.0/dist/fgta5js-v1.0.0-min.css" />
	<script src="https://cdn.jsdelivr.net/gh/fgta5/fgta5js@v1.0/dist/fgta5js-v1.0.0-min.js"></script>
	
    ...

</head>
```


### HTML Syntax
```html
<form id="myform" locked="true">
	<div class="demo-input-field" field="obj_nama">
		<label for="obj_nama">Nama</label>
		<input id="obj_nama"  fgta5-component="Textbox" placeholder="nama anda" autocomplete="off" spellcheck="false" 
			required
			value="agung" 
			style="background-color: aquamarine; "
			character-case="uppercase"
			required minlength="3" maxlength="15"
			binding="nama"
			description="isi dengan nama anda, minimal 3 karakter, maksimal 15 karakter"
			invalid-message="Nama harus diisi, minimal 3 karakter, maksimal 15 karakter"
			invalid-message-required="Nama harus diisi"
			invalid-message-minlength="Nama minimal 3 karakter"
			invalid-message-maxlength="Nama maksimal 15 karakter"
		>
	</div>

</form>
```
					```

### Rendering Form
```javascript
const form = new $fgta5.Form('myform');

form.addEventListener('locked', (evt) => { 
	// do something when form locked
});

form.addEventListener('unlocked', (evt) => {  
	// do something when form unlocked
});

form.Render()

```

### Validate and Saving Data
```javascript
async function Save() {

	// detect form changes
	if (!form.IsChanged()) {
		console.log('no changes in form')
		return
	}

	// validating form
	var isValid = form.Validate()
	if (!isValid) {
		var err = new Error('Some data in form are invalid, please fix them');
		console.warn(err.message);
		await $fgta5.MessageBox.Error(err.message)
		return
	} else {
		form.AcceptChanges()

		// getting JSON data to be save (based on data binding)
		var data = form.GetData()
		console.log(data)
	}
}
```

### Reseting form data to last saved data
```javascript
async function Reset()) {
	if (form.IsChanged()) {
		var ret = await $fgta5.MessageBox.Confirm("data changed. are you sure reset data?")
		if (ret=='ok') {
			form.Reset()
		}
	}
}
```

### Creating New Data and set data initial
```javascript
async function NewData() {
	// detect changes in form
	var newdata = true;
	if (form.IsChanged()) {
		newdata = false
		var ret = await $fgta5.MessageBox.Confirm("data changed. are you sure creating new data?")
		if (ret=='ok') {
			newdata = true
		}
	}

	if (newdata) {
		form.NewData({
			nama: "Nama Baru",   // textbox
			nilai: 60,  // numberbox
			isdisabled : true,
			kota: {value:"JKT", text:"Jakarta"},  // combobox
			tanggal: new Date(), // datebox
			jam: '11:00',
			alamat: "Alamat Baru", // textarea
		})
		form.Lock(false)
	}
}
```








