import cozysdk from 'cozysdk-client';

cozysdk.defineRequest('Photo', 'all', 'function(doc) { emit(doc.title, doc); }', function(err, res) {
    if (err != null) return alert(err);
    cozysdk.run('Photo', 'all', {}, function(err, res) {

        if (err) {
            return false;
        }

        if (res.length) {
            var first = res[0].id;

            cozysdk.getFileURL(first, 'raw', (err, photoUrl) => {
                console.log(photoUrl);
            });
        }
    });
});
