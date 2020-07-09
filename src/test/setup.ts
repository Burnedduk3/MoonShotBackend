import 'module-alias/register';
import { testConn } from './testCon';


testConn(true).then(() => process.exit());
