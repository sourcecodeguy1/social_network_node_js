// Import the plugins
const Uppy = require('@uppy/core');
const XHRUpload = require('@uppy/xhr-upload');
const Dashboard = require('@uppy/dashboard');


const uppy = Uppy({
    debug: true,
    autoProceed: false,
    restrictions: {
        maxFileSize: 5000000,
        maxNumberOfFiles: 5,
        minNumberOfFiles: 1,
        allowedFileTypes: ['image/*']
    }
})
    .use(Dashboard, {
        trigger: '.UppyModalOpenerBtn',
        inline: true,
        target: '#profile_drag-drop-area',
        replaceTargetContent: true,
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false,
        animateOpenClose: true,
        note: 'Upload 5 images at a time, up to 5 MB only!',
        height: 470,
        browserBackButtonClose: true,
        theme: 'dark'
        /*metaFields: [
            {id: 'caption', name: 'Caption', placeholder: 'describe what the image is about'}
        ]*/
    });

uppy.use(XHRUpload, {
    id: 'XHRUpload',
    endpoint: '/upload_gallery',
    method: 'POST',
    formData: true,
    fieldName: 'my_file',
    //metaFields: ['caption'],
    bundle: true,
});


uppy.on('upload-success', (file, response) => {

    //let id = $('#settings_user_id').val(); /** get current logged in user id **/

    //window.location.href = '/profile/' + id; /** redirect to user profile **/

});

module.exports = uppy;