import 'module-alias/register';
import { boilerPlate, testConn } from './testCon';

testConn(true).then(async () => {
  await boilerPlate();
  process.exit();
});
