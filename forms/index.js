const forms = require("forms")

const fields = forms.fields;
const validators = forms.validators;
const widget = forms.widgets;


var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};


const createPosterForm = (genres) => {
    return forms.create({
        "title": fields.string({
            required: true,
            errorAfterField: true,
            cssClass:{
                label: ["form-label"]
            }
        }),
        "cost": fields.string({
            required: true,
            errorAfterField: true,
            cssClass:{
                label: ["form-label"]
            },
            validators:[validators.integer()]
        }),
        "description": fields.string({
            required: true,
            errorAfterField: true,
            cssClass:{
                label: ["form-label"]
            }
        }),
        "date": fields.date({
            required: true,
            errorAfterField: true,
            cssClass:{
                label: ["form-label"]
            },
            widget: widget.date(),
        }),
        "stock": fields.string({
            required: true,
            errorAfterField: true,
            cssClass:{
                label: ["form-label"]
            },
            validators:[validators.integer()]
        }),
        "height": fields.string({
            required: true,
            errorAfterField: true,
            cssClass:{
                label: ["form-label"]
            },
            validators:[validators.integer()]
        }),
        "width": fields.string({
            required: true,
            errorAfterField: true,
            cssClass:{
                label: ["form-label"]
            },
            validators:[validators.integer()]
        }),
        "genre": fields.string({
            label:"Genre",
            required:true,
            errorAfterField: true,
            cssClass:["form-label"],
            widget:widget.multipleSelect(),
            choices:genres
        })

    })
}

const createUserForm = () =>{
    return forms.create({
        "username": fields.string({
            required:true,
            errorAfterField:true,
            cssClass:{
                label:["form-label"]
            }
        }),
        "email": fields.string({
            required:true,
            errorAfterField:true,
            cssClass:{
                label:["form-label"]
            },
            validators:[validators.email()]
        }),
        "password": fields.password({
            required:true,
            errorAfterField:true,
            cssClass:{
                label:["form-label"]
            }
        }),
        "confirm_password": fields.password({
            required:true,
            errorAfterField:true,
            cssClass:{
                label:["form-label"]
            },
            validators:[validators.matchField("password")]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        "email": fields.string({
            required: true,
            errorAfterField: true,
            cssClass:{
                label:["form-label"]
            },
            validators: [validators.email()]
        }),
        "password": fields.password({
            required:true,
            errorAfterField: true,
            cssClass:{
                label: ["form-label"]
            }
        })
    })
}

module.exports={createPosterForm,bootstrapField,createUserForm,createLoginForm}
