// exporting all interfaces
export { container } from 'tsyringe';
export * from './repositories/MongoMemberRepositoryImpl';
export * from './repositories/MongoBoardRepositoryImpl';

import { config } from './config';
config();
