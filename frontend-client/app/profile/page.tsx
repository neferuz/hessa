"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Calendar, Package, MapPin, Clock, ChevronLeft, ChevronDown, Phone, TrendingUp, Settings, Edit2, Check, X, History, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { recommendedProducts, durations } from "../login/data";
import styles from "./page.module.css";
import loginStyles from "../login/page.module.css";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [programData, setProgramData] = useState<any>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{name?: string; phone?: string; email?: string; address?: string; region?: string}>({});
    const [saving, setSaving] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const [orderHistory, setOrderHistory] = useState<any[]>([]);

    useEffect(() => {
        const userData = localStorage.getItem("hessaUser");
        if (!userData) {
            router.push("/login");
            return;
        }

        try {
            const parsed = JSON.parse(userData);
            setUser(parsed);

            // Загружаем данные программы
            const checkoutData = localStorage.getItem("hessaCheckout");
            
            let programInfo: any = {
                products: recommendedProducts,
                duration: 1,
                purchaseDate: parsed.createdAt || new Date().toISOString(),
                // Используем данные из пользователя если они есть
                address: parsed.address || null,
                region: parsed.region || null,
                name: parsed.username || null,
                phone: parsed.phone || null,
                email: parsed.email || null,
            };

            if (checkoutData) {
                try {
                    const checkout = JSON.parse(checkoutData);
                    programInfo.duration = checkout.duration || 1;
                    // Приоритет данным из checkout, но если их нет, используем из пользователя
                    programInfo.address = checkout.address || parsed.address || null;
                    programInfo.region = checkout.region || parsed.region || null;
                    programInfo.purchaseDate = checkout.purchaseDate || programInfo.purchaseDate;
                    programInfo.name = checkout.name || parsed.username || null;
                    programInfo.phone = checkout.phone || parsed.phone || null;
                    programInfo.email = checkout.email || parsed.email || null;
                } catch (e) {
                    console.error("Failed to parse checkout data", e);
                }
            }

            setProgramData(programInfo);

            // Загружаем историю заказов
            const ordersData = localStorage.getItem("hessaOrderHistory");
            if (ordersData) {
                try {
                    const orders = JSON.parse(ordersData);
                    setOrderHistory(orders);
                } catch (e) {
                    console.error("Failed to parse order history", e);
                }
            } else {
                // Если есть текущий заказ, добавляем его в историю
                if (checkoutData) {
                    try {
                        const checkout = JSON.parse(checkoutData);
                        const order = {
                            id: Date.now(),
                            date: checkout.purchaseDate || new Date().toISOString(),
                            duration: checkout.duration || 1,
                            products: recommendedProducts,
                            address: checkout.address,
                            region: checkout.region,
                            total: recommendedProducts.reduce((sum: number, p: any) => sum + parseInt(p.price.replace(/\D/g, '')), 0) * (checkout.duration || 1),
                        };
                        setOrderHistory([order]);
                        localStorage.setItem("hessaOrderHistory", JSON.stringify([order]));
                    } catch (e) {
                        console.error("Failed to create order history", e);
                    }
                }
            }
        } catch (e) {
            console.error("Failed to parse user data", e);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleEdit = (field: string, currentValue: string) => {
        setEditingField(field);
        setEditValues({ ...editValues, [field]: currentValue });
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValues({});
    };

    const handleSave = async (field: string) => {
        if (!user?.id) return;
        
        setSaving(true);
        try {
            const updateData: any = {};
            if (field === 'name') {
                updateData.username = editValues.name;
            } else if (field === 'phone') {
                updateData.phone = editValues.phone?.replace(/\D/g, '').substring(0, 9);
            } else if (field === 'email') {
                updateData.email = editValues.email;
            } else if (field === 'region') {
                updateData.region = editValues.region;
            } else if (field === 'address') {
                updateData.address = editValues.address;
            }

            const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                localStorage.setItem("hessaUser", JSON.stringify(updatedUser));
                
                // Обновляем также checkout данные если они есть
                const checkoutData = localStorage.getItem("hessaCheckout");
                if (checkoutData) {
                    const checkout = JSON.parse(checkoutData);
                    if (field === 'name') checkout.name = editValues.name;
                    if (field === 'phone') checkout.phone = editValues.phone?.replace(/\D/g, '').substring(0, 9);
                    if (field === 'email') checkout.email = editValues.email;
                    if (field === 'region') checkout.region = editValues.region;
                    if (field === 'address') checkout.address = editValues.address;
                    localStorage.setItem("hessaCheckout", JSON.stringify(checkout));
                    setProgramData((prev: any) => ({ ...prev, ...checkout }));
                }
                
                // Обновляем programData напрямую из обновленного пользователя
                if (field === 'region' || field === 'address') {
                    setProgramData((prev: any) => ({
                        ...prev,
                        [field]: editValues[field as keyof typeof editValues] || ''
                    }));
                }
                
                setEditingField(null);
                setEditValues({});
            } else {
                alert("Ошибка при сохранении данных");
            }
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Ошибка при сохранении данных");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.profileWrapper}>
            <div className={styles.profileContainer}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.header}
                >
                    <button onClick={() => router.back()} className={loginStyles.backButton}>
                        <ChevronLeft className={loginStyles.backArrow} size={18} />
                        <span>Назад</span>
                    </button>
                    <h1 className={styles.title}>Профиль</h1>
                </motion.div>

                {/* Profile Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={styles.profileHeader}
                >
                    <motion.div 
                        className={styles.avatar}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <User size={48} />
                    </motion.div>
                    <div className={styles.profileInfo}>
                        <h2 className={styles.userName}>
                            {programData?.name || user.username || user.email?.split("@")[0] || "Пользователь"}
                        </h2>
                        <p className={styles.userEmail}>{user.email}</p>
                        {programData?.phone && (
                            <p className={styles.userPhone}>+998 {programData.phone}</p>
                        )}
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/recommendations" className={styles.primaryActionBtn}>
                            Моя программа
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Info Cards Grid */}
                <div className={styles.cardsGrid}>
                    {/* Личные данные */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={styles.infoCard}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>
                                <User size={20} />
                            </div>
                            <h3 className={styles.cardTitle}>Личные данные</h3>
                        </div>
                        <div className={styles.cardContent}>
                            {user.createdAt && (
                                <div className={styles.cardItem}>
                                    <Calendar size={16} className={styles.cardItemIcon} />
                                    <div className={styles.cardItemContent}>
                                        <span className={styles.cardItemLabel}>Дата регистрации</span>
                                        <span className={styles.cardItemValue}>
                                            {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {user.source && (
                                <div className={styles.cardItem}>
                                    <Settings size={16} className={styles.cardItemIcon} />
                                    <div className={styles.cardItemContent}>
                                        <span className={styles.cardItemLabel}>Способ регистрации</span>
                                        <span className={styles.cardItemValue}>
                                            {user.source === "quiz" ? "Через викторину" : "Через email"}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className={styles.cardItem}>
                                <User size={16} className={styles.cardItemIcon} />
                                <div className={styles.cardItemContent}>
                                    <span className={styles.cardItemLabel}>Имя</span>
                                    {editingField === 'name' ? (
                                        <div className={styles.editRow}>
                                            <input
                                                type="text"
                                                value={editValues.name || programData?.name || user.username || ''}
                                                onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                                                className={styles.editInput}
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleSave('name')}
                                                className={styles.editBtn}
                                                disabled={saving}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className={styles.editBtn}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.valueRow}>
                                            <span className={styles.cardItemValue}>
                                                {programData?.name || user.username || 'Не указано'}
                                            </span>
                                            <button
                                                onClick={() => handleEdit('name', programData?.name || user.username || '')}
                                                className={styles.editIconBtn}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.cardItem}>
                                <Phone size={16} className={styles.cardItemIcon} />
                                <div className={styles.cardItemContent}>
                                    <span className={styles.cardItemLabel}>Телефон</span>
                                    {editingField === 'phone' ? (
                                        <div className={styles.editRow}>
                                            <input
                                                type="text"
                                                value={editValues.phone || programData?.phone || user.phone || ''}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    if (value.length > 9) value = value.substring(0, 9);
                                                    setEditValues({ ...editValues, phone: value });
                                                }}
                                                className={styles.editInput}
                                                placeholder="901234567"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleSave('phone')}
                                                className={styles.editBtn}
                                                disabled={saving}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className={styles.editBtn}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.valueRow}>
                                            <span className={styles.cardItemValue}>
                                                {programData?.phone || user.phone ? `+998 ${programData?.phone || user.phone}` : 'Не указано'}
                                            </span>
                                            <button
                                                onClick={() => handleEdit('phone', programData?.phone || user.phone || '')}
                                                className={styles.editIconBtn}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.cardItem}>
                                <MapPin size={16} className={styles.cardItemIcon} />
                                <div className={styles.cardItemContent}>
                                    <span className={styles.cardItemLabel}>Город</span>
                                    {editingField === 'region' ? (
                                            <div className={styles.editRow}>
                                                <input
                                                    type="text"
                                                    value={editValues.region || programData?.region || user.region || ''}
                                                    onChange={(e) => setEditValues({ ...editValues, region: e.target.value })}
                                                    className={styles.editInput}
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSave('region')}
                                                    className={styles.editBtn}
                                                    disabled={saving}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className={styles.editBtn}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={styles.valueRow}>
                                                <span className={styles.cardItemValue}>
                                                    {programData?.region || user.region || 'Не указано'}
                                                </span>
                                                <button
                                                    onClick={() => handleEdit('region', programData?.region || user.region || '')}
                                                    className={styles.editIconBtn}
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className={styles.cardItem}>
                                <MapPin size={16} className={styles.cardItemIcon} />
                                <div className={styles.cardItemContent}>
                                    <span className={styles.cardItemLabel}>Адрес</span>
                                    {editingField === 'address' ? (
                                            <div className={styles.editRow}>
                                                <input
                                                    type="text"
                                                    value={editValues.address || programData?.address || user.address || ''}
                                                    onChange={(e) => setEditValues({ ...editValues, address: e.target.value })}
                                                    className={styles.editInput}
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSave('address')}
                                                    className={styles.editBtn}
                                                    disabled={saving}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className={styles.editBtn}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={styles.valueRow}>
                                                <span className={styles.cardItemValue}>
                                                    {programData?.address || user.address || 'Не указано'}
                                                </span>
                                                <button
                                                    onClick={() => handleEdit('address', programData?.address || user.address || '')}
                                                    className={styles.editIconBtn}
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Программа */}
                    {programData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={styles.infoCard}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <Package size={20} />
                                </div>
                                <h3 className={styles.cardTitle}>Моя программа</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardItem}>
                                    <Clock size={16} className={styles.cardItemIcon} />
                                    <div className={styles.cardItemContent}>
                                        <span className={styles.cardItemLabel}>Дата оформления</span>
                                        <span className={styles.cardItemValue}>
                                            {new Date(programData.purchaseDate).toLocaleDateString("ru-RU", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.cardItem}>
                                    <Package size={16} className={styles.cardItemIcon} />
                                    <div className={styles.cardItemContent}>
                                        <span className={styles.cardItemLabel}>Период курса</span>
                                        <span className={styles.cardItemValue}>
                                            {durations.find(d => d.id === programData.duration)?.label || "1 месяц"}
                                        </span>
                                    </div>
                                </div>
                                {programData.address && (
                                    <div className={styles.cardItem}>
                                        <MapPin size={16} className={styles.cardItemIcon} />
                                        <div className={styles.cardItemContent}>
                                            <span className={styles.cardItemLabel}>Адрес доставки</span>
                                            <span className={styles.cardItemValue}>
                                                {programData.region ? `${programData.region}, ` : ""}{programData.address}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.cardItem}>
                                    <TrendingUp size={16} className={styles.cardItemIcon} />
                                    <div className={styles.cardItemContent}>
                                        <span className={styles.cardItemLabel}>Статус</span>
                                        <span className={styles.cardItemValue}>Активна</span>
                                    </div>
                                </div>
                            </div>

                            {/* История заказов */}
                            {orderHistory.length > 0 && (
                                <div className={styles.orderHistorySection}>
                                    <div className={styles.orderHistoryHeader}>
                                        <History size={18} className={styles.orderHistoryIcon} />
                                        <h4 className={styles.orderHistoryTitle}>История заказов</h4>
                                    </div>
                                    <div className={styles.orderHistoryList}>
                                        {orderHistory.map((order: any, index: number) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={styles.orderItem}
                                            >
                                                <button
                                                    className={styles.orderItemHeader}
                                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                >
                                                    <div className={styles.orderItemInfo}>
                                                        <span className={styles.orderItemDate}>
                                                            {new Date(order.date).toLocaleDateString("ru-RU", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                        <span className={styles.orderItemDuration}>
                                                            {durations.find(d => d.id === order.duration)?.label || `${order.duration} месяц`}
                                                        </span>
                                                        <span className={styles.orderItemTotal}>
                                                            {order.total?.toLocaleString('ru-RU')} сум
                                                        </span>
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: expandedOrder === order.id ? 90 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ChevronRight size={18} />
                                                    </motion.div>
                                                </button>
                                                <AnimatePresence>
                                                    {expandedOrder === order.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className={styles.orderItemDetails}
                                                        >
                                                            <div className={styles.orderProductsList}>
                                                                {order.products?.map((product: any) => (
                                                                    <div key={product.id} className={styles.orderProductItem}>
                                                                        <div className={styles.orderProductImage}>
                                                                            <Image
                                                                                src={product.image}
                                                                                alt={product.name}
                                                                                width={50}
                                                                                height={50}
                                                                                objectFit="contain"
                                                                            />
                                                                        </div>
                                                                        <div className={styles.orderProductInfo}>
                                                                            <span className={styles.orderProductName}>{product.name}</span>
                                                                            <span className={styles.orderProductPrice}>{product.price} / мес</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {order.address && (
                                                                <div className={styles.orderAddress}>
                                                                    <MapPin size={14} />
                                                                    <span>{order.region ? `${order.region}, ` : ""}{order.address}</span>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Products Section */}
                {programData?.products && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className={styles.productsSection}
                    >
                        <div className={styles.productsHeader}>
                            <div className={styles.productsHeaderLeft}>
                                <Package size={20} className={styles.productsHeaderIcon} />
                                <h3 className={styles.productsTitle}>
                                    Рекомендованные продукты ({programData.products.length})
                                </h3>
                            </div>
                        </div>
                        <div className={styles.productsGrid}>
                            {programData.products.map((product: any, index: number) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: index * 0.05,
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }}
                                    className={styles.productCard}
                                    whileHover={{ 
                                        scale: 1.02,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <div className={styles.productImage}>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={80}
                                            height={80}
                                            objectFit="contain"
                                        />
                                    </div>
                                    <div className={styles.productInfo}>
                                        <h4 className={styles.productName}>{product.name}</h4>
                                        <p className={styles.productDesc}>{product.desc}</p>
                                        <p className={styles.productPrice}>{product.price} / мес</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Logout Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={styles.logoutSection}
                >
                    <motion.button
                        className={styles.logoutButton}
                        onClick={() => {
                            localStorage.removeItem("hessaUser");
                            window.dispatchEvent(new Event("hessaAuthChange"));
                            router.push("/");
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Выйти из аккаунта
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
