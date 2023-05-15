import { DataSource, EntityManager, DeepPartial } from 'typeorm';

type Entity = any;

const queryBuilderMock = {
  leftJoin: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(['your_mocked_object_here']),
};

export const entityManagerMock: Partial<EntityManager> = {
  createQueryBuilder: jest.fn().mockImplementation(() => queryBuilderMock),
  create: jest
    .fn()
    .mockImplementation(
      (entityClass: any, plainObject?: DeepPartial<Entity>) => {
        return plainObject as typeof entityClass;
      },
    ),
  save: jest
    .fn()
    .mockImplementation((entity: Entity) => Promise.resolve(entity)),
};

export const mockDataSource: Partial<DataSource> = {
  createQueryBuilder: jest.fn().mockImplementation(() => {
    return queryBuilderMock;
  }),
  transaction: jest
    .fn()
    .mockImplementation(
      async (passedFunction) => await passedFunction(entityManagerMock),
    ),
};
