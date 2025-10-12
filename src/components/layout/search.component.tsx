import React, { useState, useEffect, useRef } from 'react';
import { Input, AutoComplete, Card, Image, Typography, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fetchBooksAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface SearchComponentProps {
    placeholder?: string;
    style?: React.CSSProperties;
}

interface BookSearchResult {
    id: number;
    title: string;
    coverImage?: string;
    price: number;
    author: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
    placeholder = "Bạn muốn tìm kiếm gì?",
    style
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    const backendUrl = "http://localhost:8080";

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            setSearchResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        setIsOpen(true);

        try {
            const query = `page=1&size=10&filter=active:true&filter=title~'${value}'`;
            const res = await fetchBooksAPI(query);

            if (res && res.data) {
                const books = res.data.result.map((book: any) => ({
                    id: book.id,
                    title: book.title,
                    coverImage: book.coverImage,
                    price: book.price,
                    author: book.author
                }));
                setSearchResults(books);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (value: string) => {
        setSearchValue(value);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search
        searchTimeoutRef.current = setTimeout(() => {
            handleSearch(value);
        }, 300);
    };

    const handleSelect = (_value: string, option: any) => {
        if (option.value === 'view-all') {
            navigate(`/?search=${encodeURIComponent(searchValue)}`);
            setSearchValue('');
            setIsOpen(false);
            return;
        }
        navigate(`/books/${option.id}`);
        setSearchValue('');
        setIsOpen(false);
    };

    const handleSearchSubmit = () => {
        if (searchValue.trim()) {
            navigate(`/?search=${encodeURIComponent(searchValue)}`);
            setSearchValue('');
            setIsOpen(false);
        }
    };

    const options = searchResults.map(book => ({
        value: book.title,
        id: book.id.toString(),
        label: (
            <Card
                size="small"
                style={{ margin: '4px 0', cursor: 'pointer' }}
                bodyStyle={{ padding: '8px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '50px', flexShrink: 0 }}>
                        {book.coverImage ? (
                            <Image
                                src={`${backendUrl}/api/v1/images/book/${book.coverImage}`}
                                alt={book.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN" />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                📚
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '2px' }}>
                            {book.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '2px' }}>
                            Tác giả: {book.author}
                        </Text>
                        <Text style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '13px' }}>
                            {book.price.toLocaleString()} VND
                        </Text>
                    </div>
                </div>
            </Card>
        )
    }));

    // Add "Xem tất cả kết quả" option if there are results
    if (searchResults.length > 0) {
        options.push({
            value: 'view-all',
            id: `${searchValue}`,
            label: (
                <div style={{
                    textAlign: 'center',
                    padding: '8px',
                    color: '#1890ff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>
                    Xem tất cả kết quả cho "{searchValue}"
                </div>
            )
        });
    }

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <style>
                {`
                    .search-input .ant-input {
                        color: #333 !important;
                        background-color: #fff !important;
                        border: none !important;
                        font-size: 14px !important;
                        outline: none !important;
                        box-shadow: none !important;
                    }
                    .search-input .ant-input::placeholder {
                        color: #999 !important;
                        font-size: 14px !important;
                    }
                    .search-input .ant-input:focus {
                        color: #333 !important;
                        background-color: #fff !important;
                        border: none !important;
                        box-shadow: none !important;
                        outline: none !important;
                    }
                    .search-input .ant-input:hover {
                        border: none !important;
                    }
                `}
            </style>
            <AutoComplete
                value={searchValue}
                options={options}
                onSearch={handleInputChange}
                onSelect={handleSelect}
                open={isOpen && (searchResults.length > 0 || isLoading)}
                onDropdownVisibleChange={(open) => {
                    if (!open) {
                        setIsOpen(false);
                    }
                }}
                style={{ width: '100%' }}
                className="search-input"
                dropdownStyle={{
                    maxHeight: '400px',
                    overflow: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                notFoundContent={
                    isLoading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Spin size="small" />
                            <div style={{ marginTop: '8px' }}>Đang tìm kiếm...</div>
                        </div>
                    ) : searchValue ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                            Không tìm thấy sản phẩm nào
                        </div>
                    ) : null
                }
            >
                <Input
                    placeholder={placeholder}
                    allowClear
                    suffix={
                        <SearchOutlined
                            style={{
                                color: '#1890ff',
                                fontSize: '18px',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                            onClick={handleSearchSubmit}
                        />
                    }
                    onPressEnter={handleSearchSubmit}
                    style={{
                        borderRadius: '20px',
                        color: '#333',
                        backgroundColor: '#fff',
                        border: 'none',
                        boxShadow: 'none',
                        ...style
                    }}
                />
            </AutoComplete>
        </div>
    );
};

export default SearchComponent;
