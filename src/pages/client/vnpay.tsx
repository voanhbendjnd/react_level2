import { initiateVnpayPaymentAPI_GET } from '@/services/api';
import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Đường dẫn Backend. Endpoint này PHẢI được cấu hình public (permitAll()) 
// ở phía Backend (Spring Security) để hoạt động mà không cần token.
const BACKEND_BASE_URL = 'http://localhost:8080';
const VNPAY_CREATE_URL = `${BACKEND_BASE_URL}/api/v1/payment/vnpay/create`;
// Giả định có endpoint này để kiểm tra kết quả (nếu cần)
const VNPAY_RETURN_URL = `${BACKEND_BASE_URL}/api/v1/payment/vnpay-return`;

// Component hiển thị trạng thái Loading
const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
);

const VnpayConfirmPage = () => {
    const location = useLocation() as any;
    const navigate = useNavigate();

    const state = location.state as { orderId?: number | string; amount?: number } | undefined;

    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [apiError, setApiError] = useState(''); // State để bắt lỗi API
    const [paymentResult, setPaymentResult] = useState<{ status: 'success' | 'failed' | 'processing' | null, message: string } | null>(null);

    // Lấy orderId và amount từ state hoặc query params (khi VNPAY trả về)
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), [location.search]);
    const urlVnpayResponseCode = urlParams.get('vnp_ResponseCode');

    const orderId = state?.orderId || urlParams.get('vnp_TxnRef');
    const amount = state?.amount ?? 0;

    const valid = useMemo(() => !!orderId && amount > 0, [orderId, amount]);

    const formattedAmount = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);


    // ==========================================================
    // 1. HÀM XỬ LÝ THANH TOÁN (SỬ DỤNG API POST KHÔNG TOKEN)
    // ==========================================================
    const handleConfirm = async () => {
        if (!valid) return;

        setApiError('');
        setIsPaymentProcessing(true);
        const res = await initiateVnpayPaymentAPI_GET(1);

        try {
            // Gửi yêu cầu POST đến Backend KHÔNG KÈM Authorization Header
            const response = await fetch(VNPAY_CREATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // KHÔNG TRUYỀN Authorization Header NHƯ YÊU CẦU
                },
                body: JSON.stringify({ orderId: Number(orderId) }), // Gửi orderId trong body
            });

            if (!response.ok) {
                // Backend phải trả về lỗi nếu không cho phép request này (ví dụ: 401/403 nếu secured)
                const errorData = await response.json().catch(() => ({ error: 'Lỗi server không xác định.' }));
                setApiError(`Khởi tạo thanh toán thất bại: ${errorData.error || response.statusText}. Vui lòng kiểm tra cấu hình Backend.`);
                return;
            }

            const data = await response.json();
            const vnpayUrl = data.vnpayUrl; // Backend trả về JSON: { "vnpayUrl": "..." }

            // Chuyển hướng đến cổng VNPAY
            window.location.href = vnpayUrl;

        } catch (error) {
            console.error('Lỗi khi gọi API VNPAY:', error);
            setApiError('Không thể kết nối đến máy chủ Backend. Vui lòng thử lại sau.');
        } finally {
            // Nếu thành công, trang sẽ chuyển hướng. Nếu thất bại, isPaymentProcessing trở về false.
            if (apiError) {
                setIsPaymentProcessing(false);
            }
        }
    };

    const handleCancel = () => {
        navigate('/checkout');
    };

    // ==========================================================
    // 2. XỬ LÝ KẾT QUẢ TRẢ VỀ TỪ VNPAY
    // ==========================================================
    useEffect(() => {
        // Chỉ chạy khi có tham số phản hồi từ VNPAY (vnp_ResponseCode)
        if (urlVnpayResponseCode !== null && orderId) {

            // Xóa state để tránh nhầm lẫn (ví dụ: lỗi 401 trước đó)
            setApiError('');
            setIsPaymentProcessing(true);

            if (urlVnpayResponseCode === '00') {
                // Giao dịch thành công (trên cổng VNPAY)
                setPaymentResult({ status: 'processing', message: 'Đang xác minh kết quả giao dịch...' });

                // (TÙY CHỌN) Gọi thêm API Backend để xác minh kết quả (nếu Backend có endpoint xác minh)
                // ... logic gọi API xác minh ...

                // HIỂN THỊ KẾT QUẢ CƠ BẢN:
                setPaymentResult({ status: 'success', message: `Thanh toán thành công cho đơn hàng: ${orderId}.` });

            } else {
                // Giao dịch thất bại hoặc bị hủy
                let message = 'Giao dịch không thành công. ';
                switch (urlVnpayResponseCode) {
                    case '07': message += 'Giao dịch bị nghi ngờ gian lận.'; break;
                    case '24': message += 'Khách hàng hủy giao dịch.'; break;
                    default: message += `Mã lỗi VNPAY: ${urlVnpayResponseCode}. Vui lòng thử lại.`; break;
                }
                setPaymentResult({ status: 'failed', message });
            }
            setIsPaymentProcessing(false);
        }
    }, [urlVnpayResponseCode, orderId]);


    // ==========================================================
    // 3. UI HIỂN THỊ
    // ==========================================================

    const renderConfirmationScreen = () => (
        <>
            {/* Thông tin đơn hàng */}
            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold">{String(orderId)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-xl text-red-600">
                        {formattedAmount}
                    </span>
                </div>
            </div>

            {/* Thông báo lỗi API */}
            {apiError && (
                <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
                    <span className="font-medium">Lỗi Kết nối:</span> {apiError}
                </div>
            )}

            {/* Nút thao tác */}
            <div className="flex flex-col gap-3">
                <button
                    className={`py-3 rounded-lg font-semibold text-white transition flex items-center justify-center ${isPaymentProcessing || apiError
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    disabled={isPaymentProcessing || !!apiError}
                    onClick={handleConfirm}
                >
                    {isPaymentProcessing ? (
                        <><LoadingSpinner /> Đang chuyển hướng...</>
                    ) : (
                        "Thanh toán VNPay"
                    )}
                </button>

                <button
                    className="py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100"
                    onClick={handleCancel}
                    disabled={isPaymentProcessing}
                >
                    Hủy giao dịch
                </button>
            </div>
        </>
    );

    const renderResultScreen = () => {
        const isSuccess = paymentResult?.status === 'success';
        const isFailed = paymentResult?.status === 'failed';
        const icon = isSuccess ? (
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        ) : isFailed ? (
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        ) : (
            <LoadingSpinner />
        );

        return (
            <>
                <div className="flex justify-center mb-6">{icon}</div>
                <h1 className={`text-2xl font-bold text-center mb-4 ${isSuccess ? 'text-green-700' : isFailed ? 'text-red-700' : 'text-gray-700'}`}>
                    {isSuccess ? 'Giao dịch thành công' : isFailed ? 'Giao dịch thất bại' : 'Đang xử lý kết quả...'}
                </h1>
                <p className={`text-center text-md mb-6 ${isFailed ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                    {paymentResult?.message}
                </p>

                {isFailed && (
                    <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-100 border border-yellow-300">
                        <span className="font-medium">Lưu ý:</span> Vui lòng kiểm tra lại trạng thái đơn hàng trong lịch sử giao dịch.
                    </div>
                )}

                <button
                    className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                    onClick={() => navigate('/orders')} // Chuyển hướng đến trang đơn hàng
                >
                    Xem chi tiết đơn hàng
                </button>
            </>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

                {/* Logo VNPAY */}
                <div className="flex justify-center mb-6">
                    <img
                        src="/vnpay-logo.png"
                        onError={(e) => {
                            // Fallback image URL
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://placehold.co/100x48/0056b3/ffffff?text=VNPAY'
                        }}
                        alt="VNPay Logo"
                        className="h-12"
                    />
                </div>

                {urlVnpayResponseCode !== null || paymentResult ? renderResultScreen() : (
                    <>
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            Xác nhận thanh toán
                        </h1>
                        <p className="text-center text-sm text-gray-500 mb-6">
                            Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay an toàn.
                        </p>
                        {!valid ? (
                            <div className="p-4 text-center text-red-600 font-medium border border-red-300 rounded-lg bg-red-50">
                                Thiếu thông tin đơn hàng hoặc số tiền. Vui lòng thử lại.
                            </div>
                        ) : renderConfirmationScreen()}
                    </>
                )}

            </div>
        </div>
    );
};

export default VnpayConfirmPage;