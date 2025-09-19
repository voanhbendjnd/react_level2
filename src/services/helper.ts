import dayjs from "dayjs";
import { FORMATE_DATE_VN } from '@/services/helper';

export const FORMATE_DATE_VN= "DD/MM/YYYY"
export const dataRangeValidate = (dateRange: any) => {
    if (!Array.isArray(dateRange) || dateRange.length !== 2) {
        return undefined;
    }

    // Lấy timestamp (miligiây) của ngày
    const startTimestamp = dayjs(dateRange[0]).startOf('day').valueOf();
    const endTimestamp = dayjs(dateRange[1]).endOf('day').valueOf();

    // Bạn cũng có thể lấy timestamp theo giây với `.unix()`
    // const startTimestamp = dayjs(dateRange[0]).startOf('day').unix();
    // const endTimestamp = dayjs(dateRange[1]).endOf('day').unix();

    return [startTimestamp, endTimestamp];
};

export const MAX_UPLOAD_IMAGE_SIZE = 2;