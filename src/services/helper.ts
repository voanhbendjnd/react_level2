import dayjs from "dayjs";

export const FORMATE_DATE_VN = "DD/MM/YYYY";
export const dataRangeValidate = (dateRange: any) => {
  if (!Array.isArray(dateRange) || dateRange.length !== 2) {
    return undefined;
  }

  // Lấy timestamp (miligiây) của ngày
  const startTimestamp = dayjs(dateRange[0]).startOf("day").valueOf();
  const endTimestamp = dayjs(dateRange[1]).endOf("day").valueOf();

  // Bạn cũng có thể lấy timestamp theo giây với `.unix()`
  // const startTimestamp = dayjs(dateRange[0]).startOf('day').unix();
  // const endTimestamp = dayjs(dateRange[1]).endOf('day').unix();

  return [startTimestamp, endTimestamp];
};

export const MAX_UPLOAD_IMAGE_SIZE = 2;

export const convertUrlToFile = async (
  url: string,
  filename: string
): Promise<File> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error(`Failed to convert URL to File: ${url}`, error);
    throw new Error(`Cannot convert image: ${filename}`);
  }
};

export const submitHiddenPost = (
  actionUrl: string,
  params: Record<string, string | number>
) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;
  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
