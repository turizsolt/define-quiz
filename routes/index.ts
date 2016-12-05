/**
 * Created by zsiri on 2016.12.05..
 */

export function defineRoutes(router) {

    router.get('/', function(req, res) {
        res.sendFile('index.html');
    });

    return router;
}
