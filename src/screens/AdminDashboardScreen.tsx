import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useOrders, Order } from '../hooks/useOrders';

// Fallback orders matching the Stitch design
const FALLBACK_ORDERS: Order[] = [
  { id: '1', customer_name: 'Sophie Miller', order_number: '#2045', status: 'pending', total: 145.00, created_at: '' },
  { id: '2', customer_name: 'James Carter', order_number: '#2044', status: 'shipped', total: 210.50, created_at: '' },
  { id: '3', customer_name: 'Elena Ray', order_number: '#2043', status: 'shipped', total: 89.99, created_at: '' },
];

function OrderItem({ order }: { order: Order }) {
  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'Pending' },
    shipped: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Shipped' },
    delivered: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Delivered' },
  };
  const s = statusColors[order.status] || statusColors.pending;

  return (
    <TouchableOpacity activeOpacity={0.9} className="flex-row items-center justify-between rounded-xl bg-surface-dark border border-surface-lighter p-4 mb-3">
      <View className="flex-row items-center gap-4">
        <View className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-lighter">
          <MaterialIcons name="inventory-2" size={20} color="#cbd5e1" />
        </View>
        <View>
          <Text className="text-sm font-bold text-white">{order.customer_name}</Text>
          <Text className="text-xs text-slate-500 mt-1">Order {order.order_number}</Text>
        </View>
      </View>
      <View className="flex-col items-end gap-1">
        <View className={`rounded-full ${s.bg} px-2.5 py-1 border border-${order.status === 'pending' ? 'orange' : 'green'}-500/20 mb-1`}>
          <Text className={`text-[10px] font-bold ${s.text}`}>{s.label}</Text>
        </View>
        <Text className="text-xs font-bold text-white">${order.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

function KpiCard({ icon, iconColor, iconBg, label, value, trend, trendUp, sparkColor, sparkPath }: {
  icon: string; iconColor: string; iconBg: string; label: string; value: string;
  trend: string; trendUp: boolean; sparkColor: string; sparkPath: string;
}) {
  return (
    <View className="flex-col gap-3 rounded-xl bg-surface-dark p-5 border border-surface-lighter shadow-lg mr-4 w-[200px]">
      <View className="flex-row justify-between items-start">
        <View className={`rounded-full ${iconBg} p-2`}>
          <MaterialIcons name={icon as any} size={20} color={iconColor} />
        </View>
        <View className={`flex-row items-center gap-1 ${trendUp ? 'bg-green-500/10' : 'bg-red-500/10'} px-2 py-0.5 rounded-full`}>
          <MaterialIcons name={trendUp ? 'trending-up' : 'trending-down'} size={14} color={trendUp ? '#22c55e' : '#ef4444'} />
          <Text className={`text-xs font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>{trend}</Text>
        </View>
      </View>
      <View>
        <Text className="text-sm font-medium text-slate-400">{label}</Text>
        <Text className="text-2xl font-bold text-white mt-1">{value}</Text>
      </View>
      <View className="h-8 w-full mt-2">
        <Svg height="100%" width="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
          {sparkColor === '#f4c025' && (
            <Defs>
              <LinearGradient id="gradientSales" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#f4c025" stopOpacity={0.2} />
                <Stop offset="1" stopColor="#f4c025" stopOpacity={0} />
              </LinearGradient>
            </Defs>
          )}
          <Path d={sparkPath} fill="none" stroke={sparkColor} strokeWidth="2" />
          {sparkColor === '#f4c025' && (
            <Path d={sparkPath + ' V 20 H 0 Z'} fill="url(#gradientSales)" stroke="none" />
          )}
        </Svg>
      </View>
    </View>
  );
}

export default function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const { orders: supabaseOrders, loading } = useOrders();
  const orders = supabaseOrders.length > 0 ? supabaseOrders : FALLBACK_ORDERS;

  const kpis = [
    { icon: 'attach-money', iconColor: '#f4c025', iconBg: 'bg-primary/10', label: 'Total Sales', value: '$12,450', trend: '12%', trendUp: true, sparkColor: '#f4c025', sparkPath: 'M0 15 Q 10 18, 20 12 T 40 10 T 60 14 T 80 5 L 100 8' },
    { icon: 'shopping-bag', iconColor: '#60a5fa', iconBg: 'bg-blue-500/10', label: 'New Orders', value: '48', trend: '2%', trendUp: false, sparkColor: '#60a5fa', sparkPath: 'M0 8 Q 15 5, 30 12 T 50 15 T 70 8 T 90 12 L 100 10' },
    { icon: 'visibility', iconColor: '#a855f7', iconBg: 'bg-purple-500/10', label: 'Visitors', value: '1.2k', trend: '5%', trendUp: true, sparkColor: '#a78bfa', sparkPath: 'M0 18 Q 20 15, 40 5 T 60 12 T 80 8 L 100 2' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-1 w-full mx-auto" style={isDesktop ? { maxWidth: 1200 } : undefined}>
        
        {/* Header */}
        <View className="flex-row items-center justify-between p-5 bg-background-dark/95 border-b border-surface-lighter z-20">
          <View className="flex-row items-center gap-3">
            <View className="relative">
              <View className="h-10 w-10 rounded-full border border-surface-lighter overflow-hidden bg-surface-dark">
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu-2fcSzsc_Ex4qn3S-ZO7TdJiN2Ed-SWbNePNrPfXWfP2pO0ORxICA-VJ5bG9YKyhcw-Z6Qnw1P_KUqQNNTnizCvWkLCm62PWkN3oju88Gsyyhky2UFlrhUU7hRBrU7DB6Bhq0SsZezcxsH0zojNVMAtyOyOgNjfbVDeuOG0Po2T812xA25X7S2u4og0h2UsN27SqQawHNSpVOB2KQQFlwnyu_TBapWRFsFKuMmvy0NhV2hb00dS8QBngAXL9g9Nz6x-LhJ0QSv22' }}
                  className="w-full h-full"
                />
              </View>
              <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background-dark" />
            </View>
            <View>
              <Text className="text-xs font-medium text-slate-400">Welcome back,</Text>
              <Text className="text-lg font-bold leading-tight text-white">Admin</Text>
            </View>
          </View>
          <TouchableOpacity className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface-dark">
            <MaterialIcons name="notifications" size={20} color="white" />
            <View className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* KPI Cards */}
          {isDesktop ? (
            <View className="flex-row gap-4 mb-6">
              {kpis.map((kpi, i) => (
                <View key={i} style={{ flex: 1 }}>
                  <KpiCard {...kpi} />
                </View>
              ))}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8, paddingRight: 16 }} className="-mx-4 px-4 w-screen max-w-full">
              {kpis.map((kpi, i) => <KpiCard key={i} {...kpi} />)}
            </ScrollView>
          )}

          {/* Revenue Chart */}
          <View className="mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-white">Sales Revenue</Text>
              <TouchableOpacity className="bg-primary/10 px-3 py-1.5 rounded-lg">
                <Text className="text-xs font-medium text-primary">Last 7 Days</Text>
              </TouchableOpacity>
            </View>
            
            <View className="rounded-xl bg-surface-dark border border-surface-lighter p-5 shadow-lg">
              <View className="mb-6 flex-col gap-1">
                <Text className="text-3xl font-bold text-white">$45,200</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-slate-400">Total Revenue</Text>
                  <Text className="text-xs font-bold text-green-500">+10.4%</Text>
                </View>
              </View>

              <View className="relative h-48 w-full">
                <View className="absolute inset-0 flex-col justify-between">
                  {['50k', '30k', '10k', '0'].map((label, idx) => (
                    <View key={idx} className="border-b border-surface-lighter/50 w-full pb-1">
                      <Text className="text-xs text-slate-600 font-medium">{label}</Text>
                    </View>
                  ))}
                </View>
                
                <View className="absolute inset-0 pt-4" style={{ zIndex: 10 }}>
                  <Svg height="100%" width="100%" viewBox="0 0 350 150" preserveAspectRatio="none">
                    <Defs>
                      <LinearGradient id="chartGradientMain" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#f4c025" stopOpacity={0.3} />
                        <Stop offset="1" stopColor="#f4c025" stopOpacity={0} />
                      </LinearGradient>
                    </Defs>
                    <Path d="M0 120 C 40 120, 50 80, 80 80 C 110 80, 120 40, 150 50 C 180 60, 200 100, 230 90 C 260 80, 280 20, 310 30 C 330 36, 340 10, 350 10" fill="none" stroke="#f4c025" strokeWidth="3" strokeLinecap="round" />
                    <Path d="M0 120 C 40 120, 50 80, 80 80 C 110 80, 120 40, 150 50 C 180 60, 200 100, 230 90 C 260 80, 280 20, 310 30 C 330 36, 340 10, 350 10 V 150 H 0 Z" fill="url(#chartGradientMain)" stroke="none" />
                  </Svg>
                </View>

                <View className="absolute top-[20%] right-[10%] flex-col items-center" style={{ zIndex: 20 }}>
                  <View className="h-3 w-3 rounded-full bg-primary border-4 border-background-dark shadow-xl" />
                  <View className="mt-2 rounded bg-surface-lighter px-2 py-1 shadow-lg border border-slate-700">
                    <Text className="text-[10px] font-bold text-white">$32k</Text>
                  </View>
                </View>
              </View>

              <View className="mt-4 flex-row justify-between px-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <Text key={day} className="text-xs font-medium text-slate-500">{day}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Recent Orders */}
          <View className="pb-4 mt-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-white">Recent Orders</Text>
              <TouchableOpacity>
                <Text className="text-sm font-medium text-primary">View All</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator color="#f4c025" />
            ) : (
              <View className="flex-col">
                {orders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </View>
            )}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
