
import { startServer } from '../server'; 

before(async () => {
    await startServer();
});

require('./login-mutation.test');
require('./user-mutation.test');
require('./user-query.test');