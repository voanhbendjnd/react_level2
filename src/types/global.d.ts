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
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
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
    interface IUser{
            id: string;
            name: string;
            email: string;
            name: string;
            role: string;
            avatar: string;
    }
    interface IFetchAccount{
        user: IUser;
    }

    interface IUsersTable{
        id: string;
        name: string;
        email: string;
        address: string;
        phone: string;
        gender: string;
        avatar: string;
        createdAt: string;
        createdBy: string;
        updatedAt: string;
        updatedBy: string;
        role: string;

    }
    interface IBooksTable{
        id: number;
        title: string;
        author: string;
        price: number;
        updatedAt: string;
        createdAt: string;
        coverImage: string;
        imgs: string[];
        categories: string[],
        publisher: string,
        isbn: string,
        description: string,
        language: string,
        stockQuantity: number,
        numberOfPages: number,
        publicationDate: string,
        sold: number;
        totalPreview: number;
    }

    
}