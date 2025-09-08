export { };
declare global {
    interface IBackendRes < T > {
        error?:string| string[];
        message: string;
        statusCode: number | string;
        data ?: T;
    }
    interface IModelPaginate<T>{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[]
    }
    interface ILogin{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            name: string;
            role: string;
            avatar: string;
            
        }
    }
    interface IRegister{
        name: string;
        email: string;
        phone: string;
        address: string;
        role: string;
        createdAt: string;
        createdBy: string;
    }
}