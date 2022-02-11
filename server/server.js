exports = {
    onAppInstallHandler: function () {
        generateTargetUrl()
            .then(function (url) {
                console.log(url)
                renderData()
            });
    },
    // args is a JSON block containing the payload information.
    // args['iparam'] will contain the installation parameter values.
    onExternalEventHandler: function (args) {
        $request.post(
            args.iparams.freshdesk_domain + "/api/v2/solutions/folders/84000198788/articles",
            {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    "Authorization": "Basic <%= encode(iparam.freshdesk_api_key) %>"
                },
                json: {
                    "title": args.data.post.topic_title,
                    "description": `<p dir="ltr">${args.data.post.raw}</p>`,
                    "folder_id": 84000198788,
                    "status": 1,
                    "unlock": true
                }
            }
        ).then(response => {
            console.info('Post created successfully');
            console.log(response);
        }, error => {
            console.error('Post creation failed');
            console.error(error);
        });
    }
};
