export interface DatabaseInterface {
    create(tableName: string, id: string, data: object): any;
    updateById(tableName: string, id: string, data: object): any;
    queryById(tableName: string, id: string): any;
    deleteById(tableName: string, id: string): void;
}