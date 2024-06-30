"use strict";
const url = "https://pruebatest.lenorgroup.com/api/PruebaTecnica/AreaCertificacionGetList";


document.addEventListener("DOMContentLoaded", async () => {
    // * -----------------------------
    // * Html elements.
    // * -----------------------------
    const divInfoCertificates = document.getElementById('div-info-certificates');
    const divWatch = document.querySelector('.watch');
    const divMsgError = document.getElementById('error-msg');
    const messageBody = document.getElementById('p-message');
    const tableBody = document.getElementById('table-body');
    const form = document.getElementById('form-filters');
    const btnSend = document.getElementById('btn-send');
    const btnReset = document.getElementById('btn-reset');

    let certificates = await getCertificates();
    if(certificates) showCertificates(certificates);

    btnSend.addEventListener('click', () => {
        managementFormSubmit(certificates)
    });
    btnReset.addEventListener('click', () => {
        resetFilters(certificates)
    });

    // * -----------------------------
    // * Functions.
    // * -----------------------------

    /** 
    * @description Fetches the certificates from the API
    * @returns {Array} List of certificates or null if there was an error.
    */
    async function getCertificates() {
        try {
            spinnerManagement(true);
            const response = await fetch(url);

            if (response.ok) {
                const json = await response.json();
                if (json.todoOk) {
                   return json.data;
                } else {
                    displayError(`Error al obtener los datos: ${json.mensaje}`);
                    return null;
                };
            }else{
                displayError(`Error: 404 not found`);
                return null;
            }
        } catch (error) {
            displayError(`Error al obtener los datos: ${json.mensaje}`);
            return null;
        } finally {
            spinnerManagement(false);
        }
    }

    /** 
    * @description Function in charge of showing or hiding the spinner
    * @param {Boolean} show - Whether to show or hide the spinner.
    */
    function spinnerManagement(show){ divWatch.classList.toggle('d-none', !show);}

    /** 
    * @description Display an error message to the user.
    * @param {String} msg - The error message to display.
    */
    function displayError(msg){
        divInfoCertificates.classList.remove('d-none');
        messageBody.innerHTML = msg;
    }

    /** 
    * @description Function in charge of hiding the error message from the user
    */
    function hideError(){
        divInfoCertificates.classList.add('d-none');
    }

     /** 
    * @description Function in charge of showing the certificates in the table .
    * @param {Array}  certificates - List of certificates to display. 
    */
    function showCertificates(certificates) {
        hideError();
        tableBody.innerHTML = "";
        
        if(certificates.length > 0) {
            certificates.forEach(certificate => {
                tableBody.innerHTML +=     
                `<tr class="table-bordered">
                    <td class="table-bordered text-center">${certificate.idAreaCertificacion }</td>
                    <td class="table-bordered">${certificate.nombre}</td>
                    <td class="table-bordered">${certificate.oTipoCertificacion.nombre}</td>
                </tr>`; 
            });
        }else {
            displayError("Su búsqueda no coincide con ninguna certificación.")    
        }
    }
    
     /** 
    * @author Lautaro Gallo https://github.com/lautarovg02
    * @description function in charge of managementing the submit event of the form and filtering the certificates. 
    * @param {Array} certificates - List of all certificates to filter.
    */
    function managementFormSubmit(certificates)  {
        const formData = new FormData(form);
        const inputName = formData.get('input-nombre').trim().toLowerCase();
        const inputKindCerticate = formData.get('input-tipo-certificacion').trim().toLowerCase();

        if(inputName || inputKindCerticate){
            divMsgError.classList.add('d-none');
            btnReset.classList.remove('d-none');
            const obtainedCertificates = certificates.filter(certificate =>
                (!inputName || certificate.nombre.toLowerCase().includes(inputName)) &&
                (!inputKindCerticate || (certificate.oTipoCertificacion && certificate.oTipoCertificacion.nombre.toLowerCase().includes(inputKindCerticate)))
            );
            form.reset();
            showCertificates(obtainedCertificates)
        }else{
            divMsgError.classList.remove('d-none');
        }
    }

    function resetFilters(certificates) {
        form.reset();
        showCertificates(certificates);
        divMsgError.classList.add('d-none');
        btnReset.classList.add('d-none');
    }

});

