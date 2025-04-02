export interface DatabaseInterface {
    create(tableName: string, id: string, data: object): Promise<any>;
    updateById(tableName: string, id: string, data: object): Promise<any>;
    queryById(tableName: string, id: string): Promise<any>;
    deleteById(tableName: string, id: string): Promise<void>;
}