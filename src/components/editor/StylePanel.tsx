import React, { useState, useRef } from 'react';
import { Image, Upload } from 'lucide-react';
import { useMenuStore, currencyOptions } from '../../stores/menuStore';
import { templates } from '../../data/templates';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';


const fontOptions = [
  { label: '思源黑体', value: 'Noto Sans SC' },
  { label: '思源宋体', value: 'Noto Serif SC' },
  { label: '马善政楷书', value: 'Ma Shan Zheng' },
  { label: '站酷高端黑', value: 'ZCOOL KuaiLe' },
  { label: '站酷快乐体', value: 'ZCOOL QingKe HuangYou' },
  { label: '汉仪楷体', value: 'ZCOOL XiaoWei' },
  { label: '庞中华钢笔体', value: 'Long Cang' },
  { label: '方正兰亭黑', value: 'Noto Sans SC' },
  { label: '华文行楷', value: 'Ma Shan Zheng' },
  { label: 'Playfair', value: 'Playfair Display' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Oswald', value: 'Oswald' },
  { label: 'Raleway', value: 'Raleway' },
  { label: 'Poppins', value: 'Poppins' },
];

const pageSizeOptions = [
  { label: 'A4纸 (210×297mm) - 标准菜单/宣传单', value: 'A4' },
  { label: 'A4横向 (297×210mm) - 横向菜单', value: 'A4-landscape' },
  { label: 'A3纸 (297×420mm) - 大型墙面海报', value: 'A3' },
  { label: 'A3横向 (420×297mm) - 大型横向海报', value: 'A3-landscape' },
  { label: 'A5纸 (148×210mm) - 便携菜单/折页', value: 'A5' },
  { label: 'A5横向 (210×148mm) - 横向便携菜单', value: 'A5-landscape' },
  { label: 'B4纸 (250×353mm) - 餐厅墙面海报', value: 'B4' },
  { label: 'B4横向 (353×250mm) - 横向墙面海报', value: 'B4-landscape' },
  { label: 'B5纸 (176×250mm) - 中型菜单/杂志', value: 'B5' },
  { label: 'B5横向 (250×176mm) - 横向中型菜单', value: 'B5-landscape' },
  { label: '小横向海报 (420×297mm) - 横向宣传海报', value: 'poster-landscape-small' },
  { label: '中横向海报 (594×420mm) - 横向展示海报', value: 'poster-landscape-medium' },
  { label: '大横向海报 (841×594mm) - 大型横向海报', value: 'poster-landscape-large' },
  { label: '小横幅 (600×200mm) - 窄幅宣传横幅', value: 'banner-small' },
  { label: '中横幅 (900×300mm) - 中等横幅海报', value: 'banner-medium' },
  { label: '大横幅 (1200×400mm) - 宽幅展示横幅', value: 'banner-large' },
  { label: 'A6纸 (105×148mm) - 桌牌/小菜单卡', value: 'A6' },
  { label: 'A7纸 (74×105mm) - 迷你卡片/酒水单', value: 'A7' },
  { label: 'A8纸 (52×74mm) - 名片大小酒水卡', value: 'A8' },
  { label: '16开 (184×260mm) - 传统菜谱', value: '16k' },
  { label: '32开 (130×184mm) - 小型菜谱', value: '32k' },
  { label: '大海报 (420×570mm) - 户外宣传海报', value: 'poster-large' },
  { label: '宽幅海报 (500×700mm) - 墙面装饰海报', value: 'poster-wide' },
  { label: '展架海报 (600×1600mm) - X展架/易拉宝', value: 'rollup' },
  { label: '名片 (90×54mm) - 餐厅名片', value: 'business-card' },
  { label: '桌牌 (100×150mm) - 桌面立牌', value: 'table-card' },
];

const layoutOptions = [
  {
    id: 'custom',
    label: '自定义布局',
    description: '自定义列数和行数的网格布局',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E自定义布局%3C/text%3E%3Crect x="30" y="50" width="70" height="70" fill="%23e0e0e0" rx="4"/%3E%3Crect x="110" y="50" width="70" height="70" fill="%23e0e0e0" rx="4"/%3E%3Crect x="190" y="50" width="70" height="70" fill="%23e0e0e0" rx="4"/%3E%3Crect x="30" y="130" width="70" height="70" fill="%23e0e0e0" rx="4"/%3E%3Crect x="110" y="130" width="70" height="70" fill="%23e0e0e0" rx="4"/%3E%3Crect x="190" y="130" width="70" height="70" fill="%23e0e0e0" rx="4"/%3E%3Ctext x="150" y="230" text-anchor="middle" font-family="Arial" font-size="12" fill="%23666"%3E可自定义列数和行数%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'vertical',
    label: '经典竖排',
    description: '菜品垂直排列，左侧图右侧文字',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E经典竖排%3C/text%3E%3Crect x="20" y="50" width="80" height="80" fill="%23e0e0e0" rx="4"/%3E%3Crect x="20" y="50" width="80" height="80" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="60" y="95" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="130" y="68" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E招牌菜名%3C/text%3E%3Ctext x="130" y="85" font-family="Arial" font-size="10" fill="%23666"%3E这是一道美味的菜品%3C/text%3E%3Ctext x="275" y="68" text-anchor="end" font-family="Arial" font-size="14" fill="%23e67e22" font-weight="bold"%3E¥58%3C/text%3E%3Crect x="20" y="145" width="80" height="80" fill="%23e0e0e0" rx="4"/%3E%3Crect x="20" y="145" width="80" height="80" fill="%230c5f7b" opacity="0.3" rx="4"/%3E%3Ctext x="60" y="190" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="130" y="163" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E特色菜品%3C/text%3E%3Ctext x="130" y="180" font-family="Arial" font-size="10" fill="%23666"%3E精选食材精心烹制%3C/text%3E%3Ctext x="275" y="163" text-anchor="end" font-family="Arial" font-size="14" fill="%23e67e22" font-weight="bold"%3E¥68%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'horizontal',
    label: '横向双栏',
    description: '两列并排展示，现代简洁',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E横向双栏%3C/text%3E%3Crect x="20" y="50" width="120" height="80" fill="%23e0e0e0" rx="4"/%3E%3Crect x="20" y="50" width="120" height="80" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="80" y="95" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="80" y="142" text-anchor="middle" font-family="Arial" font-size="11" fill="%23333" font-weight="bold"%3E菜品A%3C/text%3E%3Ctext x="80" y="158" text-anchor="middle" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥48%3C/text%3E%3Crect x="160" y="50" width="120" height="80" fill="%23e0e0e0" rx="4"/%3E%3Crect x="160" y="50" width="120" height="80" fill="%230c5f7b" opacity="0.3" rx="4"/%3E%3Ctext x="220" y="95" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="220" y="142" text-anchor="middle" font-family="Arial" font-size="11" fill="%23333" font-weight="bold"%3E菜品B%3C/text%3E%3Ctext x="220" y="158" text-anchor="middle" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥58%3C/text%3E%3Crect x="20" y="175" width="120" height="60" fill="%23e0e0e0" rx="4"/%3E%3Crect x="20" y="175" width="120" height="60" fill="%237b0c5f" opacity="0.3" rx="4"/%3E%3Ctext x="80" y="210" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="80" y="235" text-anchor="middle" font-family="Arial" font-size="10" fill="%23333" font-weight="bold"%3E菜品C%3C/text%3E%3Ctext x="80" y="248" text-anchor="middle" font-family="Arial" font-size="11" fill="%23e67e22" font-weight="bold"%3E¥38%3C/text%3E%3Crect x="160" y="175" width="120" height="60" fill="%23e0e0e0" rx="4"/%3E%3Crect x="160" y="175" width="120" height="60" fill="%235f7b0c" opacity="0.3" rx="4"/%3E%3Ctext x="220" y="210" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="220" y="235" text-anchor="middle" font-family="Arial" font-size="10" fill="%23333" font-weight="bold"%3E菜品D%3C/text%3E%3Ctext x="220" y="248" text-anchor="middle" font-family="Arial" font-size="11" fill="%23e67e22" font-weight="bold"%3E¥68%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'grid',
    label: '网格展示',
    description: '三列网格布局，整齐美观',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E网格展示%3C/text%3E%3Crect x="15" y="45" width="85" height="70" fill="%23e0e0e0" rx="4"/%3E%3Crect x="15" y="45" width="85" height="70" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="57" y="82" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="57" y="125" text-anchor="middle" font-family="Arial" font-size="10" fill="%23333" font-weight="bold"%3E菜1%3C/text%3E%3Ctext x="57" y="140" text-anchor="middle" font-family="Arial" font-size="11" fill="%23e67e22"%3E¥38%3C/text%3E%3Crect x="105" y="45" width="85" height="70" fill="%23e0e0e0" rx="4"/%3E%3Crect x="105" y="45" width="85" height="70" fill="%230c5f7b" opacity="0.3" rx="4"/%3E%3Ctext x="147" y="82" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="147" y="125" text-anchor="middle" font-family="Arial" font-size="10" fill="%23333" font-weight="bold"%3E菜2%3C/text%3E%3Ctext x="147" y="140" text-anchor="middle" font-family="Arial" font-size="11" fill="%23e67e22"%3E¥48%3C/text%3E%3Crect x="195" y="45" width="85" height="70" fill="%23e0e0e0" rx="4"/%3E%3Crect x="195" y="45" width="85" height="70" fill="%237b0c5f" opacity="0.3" rx="4"/%3E%3Ctext x="237" y="82" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="237" y="125" text-anchor="middle" font-family="Arial" font-size="10" fill="%23333" font-weight="bold"%3E菜3%3C/text%3E%3Ctext x="237" y="140" text-anchor="middle" font-family="Arial" font-size="11" fill="%23e67e22"%3E¥58%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'card',
    label: '卡片堆叠',
    description: '卡片式垂直排列，精致大方',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23f5f5f5"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E卡片堆叠%3C/text%3E%3Crect x="30" y="45" width="240" height="90" fill="%23fff" rx="8" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="38" y="53" width="75" height="75" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="75" y="92" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="130" y="68" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E精美招牌菜品%3C/text%3E%3Ctext x="130" y="85" font-family="Arial" font-size="10" fill="%23666"%3E精选新鲜食材，匠心制作%3C/text%3E%3Ctext x="255" y="68" text-anchor="end" font-family="Arial" font-size="16" fill="%23e67e22" font-weight="bold"%3E¥68%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'list',
    label: '简洁列表',
    description: '紧凑列表形式，快速浏览',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E简洁列表%3C/text%3E%3Crect x="25" y="50" width="50" height="40" fill="%23e0e0e0" rx="4"/%3E%3Crect x="25" y="50" width="50" height="40" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="50" y="72" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="90" y="60" font-family="Arial" font-size="12" fill="%23333"%3E菜品名称一%3C/text%3E%3Ctext x="270" y="60" text-anchor="end" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥38%3C/text%3E%3Crect x="25" y="100" width="50" height="40" fill="%23e0e0e0" rx="4"/%3E%3Crect x="25" y="100" width="50" height="40" fill="%230c5f7b" opacity="0.3" rx="4"/%3E%3Ctext x="50" y="122" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="90" y="110" font-family="Arial" font-size="12" fill="%23333"%3E菜品名称二%3C/text%3E%3Ctext x="270" y="110" text-anchor="end" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥48%3C/text%3E%3Crect x="25" y="150" width="50" height="40" fill="%23e0e0e0" rx="4"/%3E%3Crect x="25" y="150" width="50" height="40" fill="%237b0c5f" opacity="0.3" rx="4"/%3E%3Ctext x="50" y="172" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="90" y="160" font-family="Arial" font-size="12" fill="%23333"%3E菜品名称三%3C/text%3E%3Ctext x="270" y="160" text-anchor="end" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥58%3C/text%3E%3Crect x="25" y="200" width="50" height="40" fill="%23e0e0e0" rx="4"/%3E%3Crect x="25" y="200" width="50" height="40" fill="%235f7b0c" opacity="0.3" rx="4"/%3E%3Ctext x="50" y="222" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="90" y="210" font-family="Arial" font-size="12" fill="%23333"%3E菜品名称四%3C/text%3E%3Ctext x="270" y="210" text-anchor="end" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥68%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'magazine',
    label: '杂志排版',
    description: '多栏混合布局，图文并茂',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E杂志排版%3C/text%3E%3Crect x="20" y="45" width="140" height="100" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="90" y="97" text-anchor="middle" font-size="12" fill="%23666"%3E大图展示区%3C/text%3E%3Ctext x="90" y="155" font-family="Arial" font-size="13" fill="%23333" font-weight="bold"%3E招牌主打菜%3C/text%3E%3Ctext x="90" y="172" font-family="Arial" font-size="14" fill="%23e67e22" font-weight="bold"%3E¥88%3C/text%3E%3Crect x="175" y="45" width="100" height="55" fill="%230c5f7b" opacity="0.3" rx="4"/%3E%3Ctext x="225" y="75" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="225" y="108" font-family="Arial" font-size="10" fill="%23333" font-weight="bold"%3E菜品A%3C/text%3E%3Ctext x="225" y="122" font-family="Arial" font-size="11" fill="%23e67e22"%3E¥48%3C/text%3E%3Crect x="175" y="120" width="100" height="55" fill="%237b0c5f" opacity="0.3" rx="4"/%3E%3Ctext x="225" y="150" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="225" y="183" font-family="Arial" font-size="10" fill="%23333" font-weight="bold"%3E菜品B%3C/text%3E%3Ctext x="225" y="197" font-family="Arial" font-size="11" fill="%23e67e22"%3E¥58%3C/text%3E%3Crect x="20" y="185" width="70" height="50" fill="%235f7b0c" opacity="0.3" rx="4"/%3E%3Ctext x="55" y="212" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="55" y="242" font-family="Arial" font-size="9" fill="%23333" font-weight="bold"%3E菜C%3C/text%3E%3Crect x="100" y="185" width="60" height="50" fill="%237b5f0c" opacity="0.3" rx="4"/%3E%3Ctext x="130" y="212" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="130" y="242" font-family="Arial" font-size="9" fill="%23333" font-weight="bold"%3E菜D%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'compact',
    label: '紧凑排版',
    description: '两列紧凑布局，信息密集',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E紧凑排版%3C/text%3E%3Crect x="15" y="45" width="120" height="35" fill="%23fff" stroke="%23e0e0e0" stroke-width="1" rx="4"/%3E%3Ctext x="45" y="68" text-anchor="start" font-family="Arial" font-size="10" fill="%23333"%3E菜品名称一%3C/text%3E%3Ctext x="125" y="68" text-anchor="end" font-family="Arial" font-size="11" fill="%23e67e22" font-weight="bold"%3E¥38%3C/text%3E%3Crect x="165" y="45" width="120" height="35" fill="%23fff" stroke="%23e0e0e0" stroke-width="1" rx="4"/%3E%3Ctext x="195" y="68" text-anchor="start" font-family="Arial" font-size="10" fill="%23333"%3E菜品名称二%3C/text%3E%3Ctext x="275" y="68" text-anchor="end" font-family="Arial" font-size="11" fill="%23e67e22" font-weight="bold"%3E¥42%3C/text%3E%3Crect x="15" y="90" width="120" height="35" fill="%23fff" stroke="%23e0e0e0" stroke-width="1" rx="4"/%3E%3Ctext x="45" y="113" text-anchor="start" font-family="Arial" font-size="10" fill="%23333"%3E菜品名称三%3C/text%3E%3Ctext x="125" y="113" text-anchor="end" font-family="Arial" font-size="11" fill="%23e67e22" font-weight="bold"%3E¥48%3C/text%3E%3Crect x="165" y="90" width="120" height="35" fill="%23fff" stroke="%23e0e0e0" stroke-width="1" rx="4"/%3E%3Ctext x="195" y="113" text-anchor="start" font-family="Arial" font-size="10" fill="%23333"%3E菜品名称四%3C/text%3E%3Ctext x="275" y="113" text-anchor="end" font-family="Arial" font-size="11" fill="%23e67e22" font-weight="bold"%3E¥52%3C/text%3E%3Crect x="15" y="135" width="120" height="35" fill="%23fff" stroke="%23e0e0e0" stroke-width="1" rx="4"/%3E%3Ctext x="45" y="158" text-anchor="start" font-family="Arial" font-size="10" fill="%23333"%3E菜品名称五%3C/text%3E%3Ctext x="125" y="158" text-anchor="end" font-family="Arial" font-size="11" fill="%23e67e22" font-weight="bold"%3E¥58%3C/text%3E%3Crect x="165" y="135" width="120" height="35" fill="%23fff" stroke="%23e0e0e0" stroke-width="1" rx="4"/%3E%3Ctext x="195" y="158" text-anchor="start" font-family="Arial" font-size="10" fill="%23333"%3E菜品名称六%3C/text%3E%3Ctext x="275" y="158" text-anchor="end" font-family="Arial" font-size="11" fill="%23e67e22" font-weight="bold"%3E¥62%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'premium',
    label: '精致排版',
    description: '优雅虚线分隔，高端大气',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E精致排版%3C/text%3E%3Ctext x="30" y="70" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E招牌菜品一%3C/text%3E%3Ctext x="270" y="70" text-anchor="end" font-family="Arial" font-size="14" fill="%23e67e22" font-weight="bold"%3E¥88%3C/text%3E%3Cline x1="30" y1="82" x2="270" y2="82" stroke="%23ddd" stroke-width="1" stroke-dasharray="3,2"/%3E%3Ctext x="30" y="115" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E招牌菜品二%3C/text%3E%3Ctext x="270" y="115" text-anchor="end" font-family="Arial" font-size="14" fill="%23e67e22" font-weight="bold"%3E¥98%3C/text%3E%3Cline x1="30" y1="127" x2="270" y2="127" stroke="%23ddd" stroke-width="1" stroke-dasharray="3,2"/%3E%3Ctext x="30" y="160" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E招牌菜品三%3C/text%3E%3Ctext x="270" y="160" text-anchor="end" font-family="Arial" font-size="14" fill="%23e67e22" font-weight="bold"%3E¥108%3C/text%3E%3Cline x1="30" y1="172" x2="270" y2="172" stroke="%23ddd" stroke-width="1" stroke-dasharray="3,2"/%3E%3Ctext x="30" y="205" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E招牌菜品四%3C/text%3E%3Ctext x="270" y="205" text-anchor="end" font-family="Arial" font-size="14" fill="%23e67e22" font-weight="bold"%3E¥118%3C/text%3E%3C/svg%3E',
  },

  {
    id: 'polaroid',
    label: '宝丽来风格',
    description: '照片式卡片，复古时尚',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E宝丽来风格%3C/text%3E%3Crect x="25" y="45" width="120" height="160" fill="%23fff" rx="2" transform="rotate(-2,85,125)"/%3E%3Crect x="30" y="50" width="110" height="100" fill="%2300c5f7" opacity="0.3" rx="2"/%3E%3Ctext x="85" y="105" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="85" y="175" text-anchor="middle" font-family="Arial" font-size="10" fill="%23333"%3E菜品A%3C/text%3E%3Ctext x="85" y="192" text-anchor="middle" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥58%3C/text%3E%3Crect x="165" y="45" width="120" height="160" fill="%23fff" rx="2" transform="rotate(2,225,125)"/%3E%3Crect x="170" y="50" width="110" height="100" fill="%230c5f7b" opacity="0.3" rx="2"/%3E%3Ctext x="225" y="105" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="225" y="175" text-anchor="middle" font-family="Arial" font-size="10" fill="%23333"%3E菜品B%3C/text%3E%3Ctext x="225" y="192" text-anchor="middle" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥68%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'featured',
    label: '特色推荐',
    description: '主打菜品突出展示，视觉冲击',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E特色推荐%3C/text%3E%3Crect x="20" y="35" width="260" height="130" fill="%23fff" rx="8" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="30" y="45" width="110" height="110" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="85" y="105" text-anchor="middle" font-size="11" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="155" y="65" font-family="Arial" font-size="13" fill="%23333" font-weight="bold"%3E招牌特色菜品%3C/text%3E%3Ctext x="155" y="82" font-family="Arial" font-size="10" fill="%23666"%3E精选食材精心制作%3C/text%3E%3Ctext x="155" y="105" font-family="Arial" font-size="16" fill="%23e67e22" font-weight="bold"%3E¥98%3C/text%3E%3Crect x="20" y="175" width="85" height="60" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="25" y="180" width="35" height="35" fill="%230c5f7b" opacity="0.3" rx="2"/%3E%3Ctext x="42" y="200" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="70" y="195" font-family="Arial" font-size="9" fill="%23333"%3E菜品A%3C/text%3E%3Ctext x="100" y="210" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥38%3C/text%3E%3Crect x="115" y="175" width="85" height="60" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="120" y="180" width="35" height="35" fill="%237b0c5f" opacity="0.3" rx="2"/%3E%3Ctext x="137" y="200" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="165" y="195" font-family="Arial" font-size="9" fill="%23333"%3E菜品B%3C/text%3E%3Ctext x="195" y="210" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥48%3C/text%3E%3Crect x="210" y="175" width="70" height="60" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="215" y="180" width="30" height="30" fill="%235f7b0c" opacity="0.3" rx="2"/%3E%3Ctext x="230" y="198" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="245" y="205" font-family="Arial" font-size="9" fill="%23333"%3E菜C%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'masonry',
    label: '瀑布流',
    description: '错落有致，层次丰富',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E瀑布流%3C/text%3E%3Crect x="15" y="35" width="85" height="90" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="20" y="40" width="75" height="55" fill="%2300c5f7" opacity="0.3" rx="2"/%3E%3Ctext x="57" y="72" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="57" y="100" text-anchor="middle" font-family="Arial" font-size="9" fill="%23333"%3E菜品A%3C/text%3E%3Ctext x="57" y="115" text-anchor="middle" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥38%3C/text%3E%3Crect x="108" y="35" width="85" height="70" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="113" y="40" width="75" height="40" fill="%230c5f7b" opacity="0.3" rx="2"/%3E%3Ctext x="150" y="65" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="150" y="82" text-anchor="middle" font-family="Arial" font-size="9" fill="%23333"%3E菜品B%3C/text%3E%3Ctext x="150" y="95" text-anchor="middle" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥48%3C/text%3E%3Crect x="200" y="35" width="85" height="85" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="205" y="40" width="75" height="50" fill="%237b0c5f" opacity="0.3" rx="2"/%3E%3Ctext x="242" y="68" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="242" y="95" text-anchor="middle" font-family="Arial" font-size="9" fill="%23333"%3E菜品C%3C/text%3E%3Ctext x="242" y="110" text-anchor="middle" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥58%3C/text%3E%3Crect x="15" y="135" width="85" height="75" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="20" y="140" width="75" height="45" fill="%235f7b0c" opacity="0.3" rx="2"/%3E%3Ctext x="57" y="167" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="57" y="185" text-anchor="middle" font-family="Arial" font-size="9" fill="%23333"%3E菜品D%3C/text%3E%3Ctext x="57" y="200" text-anchor="middle" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥68%3C/text%3E%3Crect x="108" y="115" width="85" height="95" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="113" y="120" width="75" height="60" fill="%237b5f0c" opacity="0.3" rx="2"/%3E%3Ctext x="150" y="153" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="150" y="178" text-anchor="middle" font-family="Arial" font-size="9" fill="%23333"%3E菜品E%3C/text%3E%3Ctext x="150" y="195" text-anchor="middle" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥78%3C/text%3E%3Crect x="200" y="130" width="85" height="80" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="205" y="135" width="75" height="50" fill="%2300c5f7" opacity="0.3" rx="2"/%3E%3Ctext x="242" y="163" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="242" y="185" text-anchor="middle" font-family="Arial" font-size="9" fill="%23333"%3E菜品F%3C/text%3E%3Ctext x="242" y="200" text-anchor="middle" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥88%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'alternating',
    label: '左右交错',
    description: '图文交替排列，灵动活泼',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E左右交错%3C/text%3E%3Crect x="20" y="35" width="120" height="80" fill="%23fff" rx="6" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="25" y="40" width="110" height="70" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="80" y="80" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="155" y="55" font-family="Arial" font-size="11" fill="%23333" font-weight="bold"%3E菜品A%3C/text%3E%3Ctext x="155" y="72" font-family="Arial" font-size="10" fill="%23666"%3E精选食材%3C/text%3E%3Ctext x="270" y="85" text-anchor="end" font-family="Arial" font-size="13" fill="%23e67e22" font-weight="bold"%3E¥48%3C/text%3E%3Crect x="160" y="125" width="120" height="80" fill="%23fff" rx="6" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="165" y="130" width="110" height="70" fill="%230c5f7b" opacity="0.3" rx="4"/%3E%3Ctext x="220" y="170" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="125" y="145" font-family="Arial" font-size="11" fill="%23333" font-weight="bold"%3E菜品B%3C/text%3E%3Ctext x="125" y="162" font-family="Arial" font-size="10" fill="%23666"%3E匠心制作%3C/text%3E%3Ctext x="30" y="175" font-family="Arial" font-size="13" fill="%23e67e22" font-weight="bold"%3E¥58%3C/text%3E%3Crect x="20" y="215" width="120" height="30" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="25" y="220" width="50" height="20" fill="%237b0c5f" opacity="0.3" rx="2"/%3E%3Ctext x="50" y="234" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="90" y="233" font-family="Arial" font-size="9" fill="%23333"%3E菜品C%3C/text%3E%3Ctext x="135" y="233" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥38%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'minimal',
    label: '极简风格',
    description: '简约线条，高端质感',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E极简风格%3C/text%3E%3Ctext x="30" y="55" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E菜品名称一%3C/text%3E%3Cline x1="30" y1="65" x2="270" y2="65" stroke="%23ddd" stroke-width="1"/%3E%3Crect x="30" y="75" width="35" height="35" fill="%2300c5f7" opacity="0.2" rx="2"/%3E%3Ctext x="47" y="96" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="75" y="90" font-family="Arial" font-size="10" fill="%23666"%3E精选食材精心制作%3C/text%3E%3Ctext x="270" y="90" text-anchor="end" font-family="Arial" font-size="13" fill="%23333" font-weight="bold"%3E¥48%3C/text%3E%3Ctext x="30" y="135" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E菜品名称二%3C/text%3E%3Cline x1="30" y1="145" x2="270" y2="145" stroke="%23ddd" stroke-width="1"/%3E%3Crect x="30" y="155" width="35" height="35" fill="%230c5f7b" opacity="0.2" rx="2"/%3E%3Ctext x="47" y="176" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="75" y="170" font-family="Arial" font-size="10" fill="%23666"%3E匠心烹饪美味%3C/text%3E%3Ctext x="270" y="170" text-anchor="end" font-family="Arial" font-size="13" fill="%23333" font-weight="bold"%3E¥58%3C/text%3E%3Ctext x="30" y="215" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E菜品名称三%3C/text%3E%3Cline x1="30" y1="225" x2="270" y2="225" stroke="%23ddd" stroke-width="1"/%3E%3Crect x="30" y="235" width="35" height="35" fill="%237b0c5f" opacity="0.2" rx="2"/%3E%3Ctext x="47" y="256" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="75" y="250" font-family="Arial" font-size="10" fill="%23666"%3E特色推荐%3C/text%3E%3Ctext x="270" y="250" text-anchor="end" font-family="Arial" font-size="13" fill="%23333" font-weight="bold"%3E¥68%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'elegant',
    label: '优雅格调',
    description: '精致边框，优雅大方',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E优雅格调%3C/text%3E%3Crect x="20" y="35" width="260" height="70" fill="%23fff" rx="6" stroke="%23e8d5b7" stroke-width="2"/%3E%3Crect x="30" y="45" width="90" height="50" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="75" y="73" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="135" y="58" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E精致菜品A%3C/text%3E%3Ctext x="135" y="75" font-family="Arial" font-size="10" fill="%23666"%3E精选食材%3C/text%3E%3Ctext x="265" y="70" text-anchor="end" font-family="Arial" font-size="14" fill="%23e67e22" font-weight="bold"%3E¥58%3C/text%3E%3Crect x="20" y="115" width="260" height="55" fill="%23fff" rx="6" stroke="%23e8d5b7" stroke-width="2"/%3E%3Crect x="30" y="125" width="70" height="35" fill="%230c5f7b" opacity="0.3" rx="4"/%3E%3Ctext x="65" y="146" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="115" y="135" font-family="Arial" font-size="11" fill="%23333" font-weight="bold"%3E特色菜品B%3C/text%3E%3Ctext x="115" y="150" font-family="Arial" font-size="10" fill="%23666"%3E匠心制作%3C/text%3E%3Ctext x="265" y="147" text-anchor="end" font-family="Arial" font-size="13" fill="%23e67e22" font-weight="bold"%3E¥68%3C/text%3E%3Crect x="20" y="180" width="260" height="55" fill="%23fff" rx="6" stroke="%23e8d5b7" stroke-width="2"/%3E%3Crect x="30" y="190" width="70" height="35" fill="%237b0c5f" opacity="0.3" rx="4"/%3E%3Ctext x="65" y="211" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="115" y="200" font-family="Arial" font-size="11" fill="%23333" font-weight="bold"%3E招牌菜品C%3C/text%3E%3Ctext x="115" y="215" font-family="Arial" font-size="10" fill="%23666"%3E精选推荐%3C/text%3E%3Ctext x="265" y="212" text-anchor="end" font-family="Arial" font-size="13" fill="%23e67e22" font-weight="bold"%3E¥78%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'mosaic',
    label: '马赛克风格',
    description: '不规则拼贴，艺术感强',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E马赛克风格%3C/text%3E%3Crect x="15" y="35" width="140" height="90" fill="%2300c5f7" opacity="0.3" rx="6"/%3E%3Ctext x="85" y="85" text-anchor="middle" font-size="11" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="25" y="135" font-family="Arial" font-size="10" fill="%23333" font-weight="bold"%3E招牌A%3C/text%3E%3Ctext x="145" y="135" text-anchor="end" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥58%3C/text%3E%3Crect x="165" y="35" width="60" height="55" fill="%230c5f7b" opacity="0.3" rx="4"/%3E%3Ctext x="195" y="66" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="170" y="100" font-family="Arial" font-size="9" fill="%23333"%3E菜品B%3C/text%3E%3Ctext x="220" y="100" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥48%3C/text%3E%3Crect x="235" y="35" width="50" height="55" fill="%237b0c5f" opacity="0.3" rx="4"/%3E%3Ctext x="260" y="66" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="240" y="100" font-family="Arial" font-size="9" fill="%23333"%3E菜C%3C/text%3E%3Ctext x="280" y="100" font-family="Arial" font-size="10" fill="%23e67e22"%3E¥38%3C/text%3E%3Crect x="165" y="100" width="120" height="70" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="175" y="110" width="45" height="50" fill="%235f7b0c" opacity="0.3" rx="2"/%3E%3Ctext x="197" y="138" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="225" y="125" font-family="Arial" font-size="10" fill="%23333"%3E菜品D%3C/text%3E%3Ctext x="270" y="125" font-family="Arial" font-size="11" fill="%23e67e22"%3E¥68%3C/text%3E%3Ctext x="15" y="165" font-family="Arial" font-size="10" fill="%23333" font-weight="bold"%3E菜品E%3C/text%3E%3Ctext x="15" y="185" font-family="Arial" font-size="11" fill="%23e67e22" font-weight="bold"%3E¥78%3C/text%3E%3Crect x="15" y="200" width="85" height="40" fill="%237b5f0c" opacity="0.3" rx="4"/%3E%3Ctext x="57" y="223" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Crect x="110" y="200" width="60" height="40" fill="%2300c5f7" opacity="0.3" rx="4"/%3E%3Ctext x="140" y="223" text-anchor="middle" font-size="9" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="180" y="215" font-family="Arial" font-size="10" fill="%23333"%3E菜品F%3C/text%3E%3Ctext x="240" y="215" font-family="Arial" font-size="11" fill="%23e67e22"%3E¥88%3C/text%3E%3Crect x="180" y="180" width="105" height="55" fill="%23fff" rx="4" stroke="%23e0e0e0" stroke-width="1"/%3E%3C/svg%3E',
  },
  {
    id: 'spotlight',
    label: '聚光灯',
    description: '突出首菜，其他菜品环绕展示',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E聚光灯%3C/text%3E%3Crect x="20" y="35" width="260" height="100" fill="%23fff" rx="10" stroke="%23d97706" stroke-width="2"/%3E%3Crect x="30" y="45" width="120" height="80" fill="%2300c5f7" opacity="0.3" rx="6"/%3E%3Ctext x="90" y="90" text-anchor="middle" font-size="10" fill="%23666"%3E菜品图%3C/text%3E%3Ctext x="165" y="65" font-family="Arial" font-size="12" fill="%23333" font-weight="bold"%3E招牌推荐%3C/text%3E%3Ctext x="165" y="85" font-family="Arial" font-size="10" fill="%23666"%3E招牌菜品%3C/text%3E%3Ctext x="265" y="100" text-anchor="end" font-family="Arial" font-size="16" fill="%23d97706" font-weight="bold"%3E¥88%3C/text%3E%3Crect x="20" y="145" width="120" height="50" fill="%23fff" rx="6" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="25" y="150" width="50" height="40" fill="%230c5f7b" opacity="0.3" rx="4"/%3E%3Ctext x="50" y="172" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="85" y="162" font-family="Arial" font-size="10" fill="%23333"%3E菜品A%3C/text%3E%3Ctext x="130" y="178" text-anchor="end" font-family="Arial" font-size="11" fill="%23e67e22"%3E¥48%3C/text%3E%3Crect x="160" y="145" width="120" height="50" fill="%23fff" rx="6" stroke="%23e0e0e0" stroke-width="1"/%3E%3Crect x="165" y="150" width="50" height="40" fill="%237b0c5f" opacity="0.3" rx="4"/%3E%3Ctext x="190" y="172" text-anchor="middle" font-size="8" fill="%23666"%3E图%3C/text%3E%3Ctext x="225" y="162" font-family="Arial" font-size="10" fill="%23333"%3E菜品B%3C/text%3E%3Ctext x="270" y="178" text-anchor="end" font-family="Arial" font-size="11" fill="%23e67e22"%3E¥58%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'gallery',
    label: '画廊风格',
    description: '图片为主，文字点缀，艺术气息',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23f5f5f5"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E画廊风格%3C/text%3E%3Crect x="20" y="35" width="120" height="100" fill="%2300c5f7" opacity="0.4" rx="8" stroke="%2300c5f7" stroke-width="1"/%3E%3Ctext x="80" y="88" text-anchor="middle" font-size="11" fill="%23333"%3E菜品展示%3C/text%3E%3Ctext x="80" y="108" font-family="Arial" font-size="9" fill="%23666"%3E菜品A%3C/text%3E%3Ctext x="130" y="150" text-anchor="end" font-family="Arial" font-size="14" fill="%23e67e22" font-weight="bold"%3E¥68%3C/text%3E%3Crect x="160" y="35" width="120" height="70" fill="%230c5f7b" opacity="0.4" rx="8" stroke="%230c5f7b" stroke-width="1"/%3E%3Ctext x="220" y="70" text-anchor="middle" font-size="11" fill="%23333"%3E精品菜式%3C/text%3E%3Ctext x="270" y="120" text-anchor="end" font-family="Arial" font-size="13" fill="%23e67e22" font-weight="bold"%3E¥78%3C/text%3E%3Crect x="20" y="150" width="90" height="80" fill="%237b0c5f" opacity="0.4" rx="8" stroke="%237b0c5f" stroke-width="1"/%3E%3Ctext x="65" y="195" text-anchor="middle" font-size="10" fill="%23333"%3E精选菜%3C/text%3E%3Ctext x="105" y="235" text-anchor="end" font-family="Arial" font-size="12" fill="%23e67e22" font-weight="bold"%3E¥58%3C/text%3E%3Crect x="125" y="125" width="155" height="105" fill="%235f7b0c" opacity="0.4" rx="8" stroke="%235f7b0c" stroke-width="1"/%3E%3Ctext x="202" y="178" text-anchor="middle" font-size="12" fill="%23333"%3E招牌菜品%3C/text%3E%3Ctext x="275" y="225" text-anchor="end" font-family="Arial" font-size="15" fill="%23e67e22" font-weight="bold"%3E¥88%3C/text%3E%3C/svg%3E',
  },

  {
    id: 'newspaper',
    label: '报纸式',
    description: '经典报纸排版，复古有格调',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23faf5e6"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Times New Roman" font-size="14" fill="%23333"%3E报纸式%3C/text%3E%3Cline x1="20" y1="30" x2="280" y2="30" stroke="%23333" stroke-width="1"/%3E%3Ctext x="25" y="50" font-family="Times New Roman" font-size="12" font-weight="bold" fill="%23333"%3E招牌菜品%3C/text%3E%3Ctext x="25" y="65" font-family="Times New Roman" font-size="9" fill="%23666"%3E精选食材%3C/text%3E%3Ctext x="275" y="65" text-anchor="end" font-family="Times New Roman" font-size="12" fill="%23e67e22"%3E¥68%3C/text%3E%3Cline x1="20" y1="75" x2="145" y2="75" stroke="%23ddd" stroke-width="1"/%3E%3Cline x1="150" y1="30" x2="150" y2="240" stroke="%23ddd" stroke-width="1"/%3E%3Ctext x="155" y="50" font-family="Times New Roman" font-size="11" font-weight="bold" fill="%23333"%3E特色小食%3C/text%3E%3Ctext x="155" y="65" font-family="Times New Roman" font-size="9" fill="%23666"%3E精心制作%3C/text%3E%3Ctext x="275" y="90" text-anchor="end" font-family="Times New Roman" font-size="11" fill="%23e67e22"%3E¥38%3C/text%3E%3Ctext x="25" y="95" font-family="Times New Roman" font-size="11" font-weight="bold" fill="%23333"%3E经典主食%3C/text%3E%3Ctext x="25" y="110" font-family="Times New Roman" font-size="9" fill="%23666"%3E美味呈现%3C/text%3E%3Ctext x="275" y="125" text-anchor="end" font-family="Times New Roman" font-size="11" fill="%23e67e22"%3E¥58%3C/text%3E%3Crect x="25" y="135" width="115" height="60" fill="%23ddd" opacity="0.5" rx="2"/%3E%3Ctext x="83" y="170" text-anchor="middle" font-family="Times New Roman" font-size="10" fill="%23999"%3E图片占位%3C/text%3E%3Ctext x="155" y="115" font-family="Times New Roman" font-size="11" font-weight="bold" fill="%23333"%3E甜品饮品%3C/text%3E%3Ctext x="155" y="130" font-family="Times New Roman" font-size="9" fill="%23666"%3E甜蜜时光%3C/text%3E%3Ctext x="275" y="155" text-anchor="end" font-family="Times New Roman" font-size="11" fill="%23e67e22"%3E¥48%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'tag',
    label: '标签式',
    description: '像便利贴一样，活泼有趣',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%23fafafa"/%3E%3Ctext x="150" y="20" text-anchor="middle" font-family="Arial" font-size="14" fill="%23333"%3E标签式%3C/text%3E%3Crect x="25" y="40" width="120" height="50" fill="%23fff3cd" rx="4" transform="rotate(-2,85,65)"/%3E%3Ctext x="85" y="60" font-family="Arial" font-size="10" fill="%23333"%3E招牌菜品A%3C/text%3E%3Ctext x="135" y="75" text-anchor="end" font-family="Arial" font-size="12" fill="%23d97706"%3E¥58%3C/text%3E%3Crect x="155" y="45" width="120" height="50" fill="%23d1fae5" rx="4" transform="rotate(1,215,70)"/%3E%3Ctext x="215" y="65" font-family="Arial" font-size="10" fill="%23333"%3E特色小食B%3C/text%3E%3Ctext x="265" y="80" text-anchor="end" font-family="Arial" font-size="12" fill="%23065f46"%3E¥38%3C/text%3E%3Crect x="35" y="105" width="110" height="50" fill="%23dbeafe" rx="4" transform="rotate(2,90,130)"/%3E%3Ctext x="90" y="125" font-family="Arial" font-size="10" fill="%23333"%3E经典主食C%3C/text%3E%3Ctext x="135" y="140" text-anchor="end" font-family="Arial" font-size="12" fill="%231d4ed8"%3E¥48%3C/text%3E%3Crect x="150" y="110" width="125" height="50" fill="%23fce7f3" rx="4" transform="rotate(-1,213,135)"/%3E%3Ctext x="213" y="130" font-family="Arial" font-size="10" fill="%23333"%3E甜品饮品D%3C/text%3E%3Ctext x="265" y="145" text-anchor="end" font-family="Arial" font-size="12" fill="%23be185d"%3E¥42%3C/text%3E%3Crect x="80" y="170" width="130" height="55" fill="%23fef3c7" rx="4" transform="rotate(1,145,198)"/%3E%3Ctext x="145" y="193" font-family="Arial" font-size="11" fill="%23333"%3E招牌推荐E%3C/text%3E%3Ctext x="200" y="210" text-anchor="end" font-family="Arial" font-size="13" fill="%23b45309"%3E¥88%3C/text%3E%3C/svg%3E',
  },

];

// 预设颜色
const colorPresets = [
  '#FAF8F5', '#FFFFFF', '#F5F0E8', '#EDE7D9', '#F8E8DB',
  '#FFF3E0', '#FFECB3', '#FFF8E1', '#F1F8E9', '#E8F5E9',
  '#E0F7FA', '#E3F2FD', '#EDE7F6', '#FCE4EC', '#FFEBEE',
];

const gradientDirections = [
  { label: '无渐变', value: 'none' },
  { label: '从左\n到右', value: 'to right' },
  { label: '从右\n到左', value: 'to left' },
  { label: '从上\n到下', value: 'to bottom' },
  { label: '从下\n到上', value: 'to top' },
  { label: '左上到\n右下', value: '135deg' },
  { label: '右上到\n左下', value: '315deg' },
  { label: '右下到\n右上', value: 'to bottom right' },
  { label: '左下到\n右上', value: 'to bottom left' },
  { label: '斜向\n左上', value: '45deg' },
  { label: '中心\n渐变', value: 'radial-center' },
  { label: '四周\n渐变', value: 'radial-corner' },
];

// 蒙版效果
const maskPresets = [
  { label: '无蒙版', value: 'none' },
  { label: '轻微暗化', value: 'rgba(0,0,0,0.1)' },
  { label: '中等暗化', value: 'rgba(0,0,0,0.3)' },
  { label: '深度暗化', value: 'rgba(0,0,0,0.5)' },
  { label: '高斯模糊', value: 'blur' },
  { label: '复古滤镜', value: 'sepia' },
  { label: '黑白效果', value: 'grayscale' },
  { label: '柔和暖光', value: 'warm' },
];

// 蒙版预览图（使用美食图片展示真实效果）
const MASK_BASE_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop';

const getMaskStyle = (maskValue: string) => {
  switch (maskValue) {
    case 'rgba(0,0,0,0.1)':
      return '';
    case 'rgba(0,0,0,0.3)':
      return '';
    case 'rgba(0,0,0,0.5)':
      return '';
    case 'blur':
      return 'blur-sm';
    case 'sepia':
      return 'sepia';
    case 'grayscale':
      return 'grayscale';
    case 'warm':
      return 'brightness-110 saturate-125';
    default:
      return '';
  }
};

const getMaskOverlayStyle = (maskValue: string) => {
  switch (maskValue) {
    case 'rgba(0,0,0,0.1)':
      return 'rgba(0,0,0,0.1)';
    case 'rgba(0,0,0,0.3)':
      return 'rgba(0,0,0,0.3)';
    case 'rgba(0,0,0,0.5)':
      return 'rgba(0,0,0,0.5)';
    case 'warm':
      return 'rgba(255,200,100,0.3)';
    default:
      return 'transparent';
  }
};

const getMaskPreview = (maskValue: string) => {
  return MASK_BASE_IMAGE;
};

// 背景图片预设
const backgroundImagePresets = [
  { label: '木质纹理', value: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
  { label: '布艺纹理', value: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800' },
  { label: '石质纹理', value: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800' },
  { label: '简约几何', value: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800' },
  { label: '美食氛围', value: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800' },
];

export const StylePanel: React.FC = () => {
  const { currentMenu, updateStyle } = useMenuStore();
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const [activeBackgroundTab, setActiveBackgroundTab] = useState<'solid' | 'image'>('solid');
  const [customColor1, setCustomColor1] = useState('#FAF8F5');
  const [customColor2, setCustomColor2] = useState('#FFFFFF');
  const [customGradientDirection, setCustomGradientDirection] = useState('none');
  const [customBackgroundImages, setCustomBackgroundImages] = useState<string[]>([]);
  const [selectedMask, setSelectedMask] = useState('none');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showMaskPreview, setShowMaskPreview] = useState<{ mask: string, label: string } | null>(null);
  const [spacingUnit, setSpacingUnit] = useState<'mm' | 'cm' | 'px'>('mm');
  const [customColumns, setCustomColumns] = useState(currentMenu?.style.customLayout?.columns || 3);
  const [customRows, setCustomRows] = useState(currentMenu?.style.customLayout?.rows || 2);

  
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const spacingUnitOptions = [
    { label: '毫米', value: 'mm' },
    { label: '厘米', value: 'cm' },
    { label: '像素', value: 'px' },
  ];

  const convertToPx = (value: number, unit: 'mm' | 'cm' | 'px'): number => {
    switch (unit) {
      case 'cm':
        return value * 37.795275591;
      case 'mm':
        return value * 3.7795275591;
      case 'px':
      default:
        return value;
    }
  };

  const convertFromPx = (pxValue: number, unit: 'mm' | 'cm' | 'px'): number => {
    switch (unit) {
      case 'cm':
        return Math.round(pxValue / 37.795275591 * 10) / 10;
      case 'mm':
        return Math.round(pxValue / 3.7795275591 * 10) / 10;
      case 'px':
      default:
        return pxValue;
    }
  };

  const getMaxValue = (unit: 'mm' | 'cm' | 'px'): number => {
    switch (unit) {
      case 'cm':
        return 100;
      case 'mm':
        return 1000;
      case 'px':
      default:
        return 3780;
    }
  };

  const getMinValue = (unit: 'mm' | 'cm' | 'px'): number => {
    switch (unit) {
      case 'cm':
        return 0.5;
      case 'mm':
        return 5;
      case 'px':
      default:
        return 2;
    }
  };

  const getStep = (unit: 'mm' | 'cm' | 'px'): number => {
    switch (unit) {
      case 'cm':
        return 0.1;
      case 'mm':
        return 1;
      case 'px':
      default:
        return 1;
    }
  };

  if (!currentMenu) {
    return (
      <div className="text-center text-gray-500 py-8">
        未加载菜单
      </div>
    );
  }

  const { style } = currentMenu;

  const currentTemplate = templates.find(t => t.id === currentMenu.templateId);
  
  const solidPresets = [
    { label: '米白色', value: '#FAF8F5' },
    { label: '现代白', value: '#FFFFFF' },
    { label: '暖黄色', value: '#F5F0E8' },
    { label: '原木色', value: '#EDE7D9' },
    { label: '灰蓝色', value: '#F0F4F8' },
  ];

  // 精选背景预设（按餐厅场景分类）
  const imagePresets = [
    { 
      label: '中式餐厅', 
      value: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    },
    { 
      label: '西餐咖啡', 
      value: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
    },
    { 
      label: '日料寿司', 
      value: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop',
    },
    { 
      label: '火锅烧烤', 
      value: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    },
    { 
      label: '甜品烘焙', 
      value: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&h=600&fit=crop',
    },
  ];

  const handlePickColor = () => {
    colorPickerRef.current?.click();
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor1(e.target.value);
    updateStyle({
      backgroundType: 'solid',
      backgroundColor: e.target.value,
      backgroundImage: undefined,
    });
  };

  const handleSelectSolidPreset = (color: string) => {
    setCustomColor1(color);
    updateStyle({
      backgroundType: 'solid',
      backgroundColor: color,
      backgroundImage: undefined,
    });
  };

  const handleApplyCustomGradient = () => {
    if (customGradientDirection === 'none') {
      updateStyle({
        backgroundType: 'solid',
        backgroundColor: customColor1,
        backgroundImage: undefined,
      });
    } else if (customGradientDirection === 'radial-center') {
      const gradient = `radial-gradient(circle, ${customColor1}, ${customColor2})`;
      updateStyle({
        backgroundType: 'gradient',
        backgroundColor: undefined,
        backgroundImage: gradient,
      });
    } else if (customGradientDirection === 'radial-corner') {
      const gradient = `radial-gradient(circle, ${customColor2}, ${customColor1})`;
      updateStyle({
        backgroundType: 'gradient',
        backgroundColor: undefined,
        backgroundImage: gradient,
      });
    } else {
      const direction = customGradientDirection || '135deg';
      const gradient = `linear-gradient(${direction}, ${customColor1}, ${customColor2})`;
      updateStyle({
        backgroundType: 'gradient',
        backgroundColor: undefined,
        backgroundImage: gradient,
      });
    }
  };

  const handleSelectImagePreset = (image: string) => {
    updateStyle({
      backgroundType: 'image',
      backgroundImage: image,
      backgroundColor: undefined,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newImages = [...customBackgroundImages];
        newImages[index] = result;
        setCustomBackgroundImages(newImages);
        updateStyle({
          backgroundType: 'image',
          backgroundImage: result,
          backgroundColor: undefined,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectCustomImage = (image: string) => {
    updateStyle({
      backgroundType: 'image',
      backgroundImage: image,
      backgroundColor: undefined,
    });
  };

  const handleDeleteCustomImage = (index: number) => {
    const newImages = [...customBackgroundImages];
    newImages.splice(index, 1);
    setCustomBackgroundImages(newImages);
  };

  const handleMaskChange = (maskValue: string) => {
    setSelectedMask(maskValue);
    updateStyle({
      backgroundMask: maskValue,
    });
  };

  const renderBackgroundPreview = () => {
    if (style.backgroundType === 'solid') {
      return { backgroundColor: style.backgroundColor };
    } else if (style.backgroundType === 'gradient') {
      return { background: style.backgroundImage };
    } else {
      return {
        backgroundImage: `url(${style.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
  };

  const handleSelectLayout = (layoutId: string) => {
    setSelectedLayout(layoutId);
    if (layoutId === 'custom') {
      updateStyle({ 
        layoutType: layoutId as any,
        customLayout: { columns: customColumns, rows: customRows }
      });
    } else {
      updateStyle({ layoutType: layoutId as any });
    }
    setShowLayoutModal(false);
  };

  const handleCustomLayoutChange = (columns: number, rows: number) => {
    setCustomColumns(columns);
    setCustomRows(rows);
    if (style.layoutType === 'custom') {
      updateStyle({ 
        customLayout: { columns, rows }
      });
    }
  };

  const currentLayout = layoutOptions.find(l => l.id === style.layoutType);

  // 判断页面大小方向
  const getOrientation = (pageSize: string): 'portrait' | 'landscape' => {
    const landscapeSuffixes = ['-landscape', 'banner-', 'poster-landscape-', 'rollup'];
    if (landscapeSuffixes.some(suffix => pageSize.endsWith(suffix) || pageSize.startsWith('banner'))) {
      return 'landscape';
    }
    return 'portrait';
  };

  // 根据页面大小推荐合适的排版方式
  const getRecommendedLayout = (pageSize: string): string => {
    const orientation = getOrientation(pageSize);
    if (orientation === 'landscape') {
      // 横向页面推荐横向双栏等横向布局
      const landscapeLayouts = ['horizontal', 'carousel', 'alternating', 'masonry'];
      if (pageSize.startsWith('banner')) {
        return 'horizontal';
      }
      return 'horizontal';
    }
    // 纵向页面推荐纵向布局
    return 'vertical';
  };

  // 处理页面大小变化
  const handlePageSizeChange = (newPageSize: string) => {
    const recommendedLayout = getRecommendedLayout(newPageSize);
    updateStyle({
      pageSize: newPageSize,
      layoutType: recommendedLayout as any
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">页面大小</h3>
        <select
          value={style.pageSize}
          onChange={(e) => handlePageSizeChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg hover:border-amber-500 transition-colors bg-white cursor-pointer"
        >
          {pageSizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">排版方式</h3>
        <button
          onClick={() => setShowLayoutModal(true)}
          className="w-full p-3 border border-gray-300 rounded-lg hover:border-amber-500 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{currentLayout?.label}</div>
              <div className="text-sm text-gray-500">{currentLayout?.description}</div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {style.layoutType === 'custom' && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">自定义布局设置</h3>
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm mb-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">提示</p>
                <p className="text-xs mt-1">布局受页面大小限制。如果列数或行数过多，预览时会自动隐藏超出的部分并显示提示。</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">列数</label>
              <input
                type="number"
                min="1"
                value={customColumns}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1) {
                    handleCustomLayoutChange(val, customRows);
                  }
                }}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">行数</label>
              <input
                type="number"
                min="1"
                value={customRows}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1) {
                    handleCustomLayoutChange(customColumns, val);
                  }
                }}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          背景设置
          {currentTemplate && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({currentTemplate.name}模板)
            </span>
          )}
        </h3>

        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveBackgroundTab('solid')}
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeBackgroundTab === 'solid'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            纯色渐变
          </button>
          <button
            onClick={() => setActiveBackgroundTab('image')}
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeBackgroundTab === 'image'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            背景图片
          </button>
        </div>

        {activeBackgroundTab === 'solid' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">自定义颜色</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 grid grid-cols-5 gap-1">
                  {colorPresets.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomColor1(color)}
                      className={`
                        w-full aspect-square rounded-md border-2 transition-all
                        ${customColor1 === color ? 'border-amber-500 ring-2 ring-amber-200' : 'border-transparent hover:border-gray-300'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <button
                    onClick={handlePickColor}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-amber-500 flex items-center justify-center transition-all"
                    style={{ backgroundColor: customColor1 }}
                  >
                    <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </button>
                  <input
                    ref={colorPickerRef}
                    type="color"
                    value={customColor1}
                    onChange={handleColorPickerChange}
                    className="absolute -z-10 opacity-0"
                  />
                  <span className="text-xs text-black mt-1 w-full text-center">取色</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">渐变设置</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColor1}
                    onChange={(e) => setCustomColor1(e.target.value)}
                    className="w-12 h-12 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <span className="text-black font-bold text-lg">→</span>
                  <div
                    className="flex-1 h-12 rounded-md border border-gray-300"
                    style={{
                      background: customGradientDirection === 'none' 
                        ? customColor1 
                        : customGradientDirection === 'radial-center'
                        ? `radial-gradient(circle, ${customColor1}, ${customColor2})`
                        : customGradientDirection === 'radial-corner'
                        ? `radial-gradient(circle, ${customColor2}, ${customColor1})`
                        : `linear-gradient(${customGradientDirection}, ${customColor1}, ${customColor2})`,
                    }}
                    title="渐变预览"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {gradientDirections.map((direction) => (
                    <button
                      key={direction.value}
                      onClick={() => setCustomGradientDirection(direction.value)}
                      className={`
                        py-2 px-1 h-16 rounded-md border-2 transition-all flex flex-col items-center justify-center
                        ${customGradientDirection === direction.value
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }
                      `}
                      title={direction.label}
                    >
                      <span className="text-xs leading-relaxed whitespace-pre-wrap text-center">
                        {direction.label}
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleApplyCustomGradient}
                  className="w-full"
                  size="sm"
                >
                  应用渐变
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeBackgroundTab === 'image' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">精选背景</h4>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {imagePresets.map((preset, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`
                        w-full aspect-video rounded-lg border-2 transition-all overflow-hidden relative group cursor-pointer
                        ${style.backgroundImage === preset.value
                          ? 'border-amber-500 ring-2 ring-amber-200'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => setShowImagePreview(preset.value)}
                      title="单击放大查看，单击下方选择按钮使用此背景"
                    >
                      <img
                        src={preset.value}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectImagePreset(preset.value)}
                      className={`
                        w-full mt-1 py-1 px-2 text-xs rounded transition-all
                        ${style.backgroundImage === preset.value
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      选择
                    </button>
                    <div className="text-xs text-gray-600 text-center truncate mt-1">{preset.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">自定义背景</h4>
              <p className="text-xs text-gray-500 mb-2">建议比例：16:9 | 推荐大小：1920x1080 像素</p>
              <div className="mb-3">
                <div className="relative">
                  {customBackgroundImages[0] ? (
                    <>
                      <button
                        onClick={() => handleSelectCustomImage(customBackgroundImages[0])}
                        className={`
                          w-full aspect-video rounded-lg border-2 transition-all overflow-hidden
                          ${style.backgroundImage === customBackgroundImages[0]
                            ? 'border-amber-500 ring-2 ring-amber-200'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <img
                          src={customBackgroundImages[0]}
                          alt="自定义背景"
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomImage(0)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <label className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-500 hover:bg-amber-50 transition-all flex flex-col items-center justify-center cursor-pointer">
                      <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-gray-500">上传图片</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 0)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">图片蒙版</h4>
              <div className="grid grid-cols-4 gap-2">
                {maskPresets.map((preset, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`
                        rounded-lg border-2 transition-all overflow-hidden cursor-pointer relative group
                        ${selectedMask === preset.value
                          ? 'border-amber-500 ring-2 ring-amber-200'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => setShowMaskPreview({ mask: preset.value, label: preset.label })}
                      title="单击放大查看效果"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={MASK_BASE_IMAGE}
                          alt={preset.label}
                          className={`w-full h-full object-cover ${getMaskStyle(preset.value)}`}
                        />
                        {getMaskOverlayStyle(preset.value) !== 'transparent' && (
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{ backgroundColor: getMaskOverlayStyle(preset.value) }}
                          />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMaskChange(preset.value)}
                      className={`
                        w-full mt-1 py-1 px-2 text-xs rounded transition-all
                        ${selectedMask === preset.value
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      选择
                    </button>
                    <div className="text-xs text-gray-600 text-center mt-1 truncate">{preset.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          字体设置
          <span className="font-normal text-xs text-gray-400">(编辑菜品时可个性化调整)</span>
        </h3>
        <select
          value={style.fontFamily}
          onChange={(e) => updateStyle({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {fontOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          字体大小
          <span className="font-normal text-xs text-gray-400">(编辑菜品时可个性化调整)</span>
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="50"
            value={style.fontSize}
            onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-700 w-16">
            {style.fontSize}px
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          文字颜色
          <span className="font-normal text-xs text-gray-400">(编辑菜品时可个性化调整)</span>
        </h3>
        <input
          type="color"
          value={style.textColor}
          onChange={(e) => updateStyle({ textColor: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Image size={16} className="text-gray-500" />
          页面边距
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 grid grid-cols-4 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block text-center">上</label>
              <input
                type="number"
                value={style.pageMargin?.top ?? 20}
                onChange={(e) => updateStyle({
                  pageMargin: { 
                    ...(style.pageMargin || { top: 20, right: 20, bottom: 20, left: 20 }), 
                    top: Number(e.target.value) || 0 
                  }
                })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block text-center">右</label>
              <input
                type="number"
                value={style.pageMargin?.right ?? 20}
                onChange={(e) => updateStyle({
                  pageMargin: { 
                    ...(style.pageMargin || { top: 20, right: 20, bottom: 20, left: 20 }), 
                    right: Number(e.target.value) || 0 
                  }
                })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block text-center">下</label>
              <input
                type="number"
                value={style.pageMargin?.bottom ?? 20}
                onChange={(e) => updateStyle({
                  pageMargin: { 
                    ...(style.pageMargin || { top: 20, right: 20, bottom: 20, left: 20 }), 
                    bottom: Number(e.target.value) || 0 
                  }
                })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block text-center">左</label>
              <input
                type="number"
                value={style.pageMargin?.left ?? 20}
                onChange={(e) => updateStyle({
                  pageMargin: { 
                    ...(style.pageMargin || { top: 20, right: 20, bottom: 20, left: 20 }), 
                    left: Number(e.target.value) || 0 
                  }
                })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <select
            value={style.pageMarginUnit || 'mm'}
            onChange={(e) => updateStyle({ pageMarginUnit: e.target.value as 'mm' | 'cm' | 'px' })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 h-full"
          >
            <option value="mm">毫米</option>
            <option value="cm">厘米</option>
            <option value="px">像素</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">货币单位</h3>
        <select
          value={style.currency}
          onChange={(e) => updateStyle({ currency: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {currencyOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">间距设置</h3>
          <select
            value={spacingUnit}
            onChange={(e) => setSpacingUnit(e.target.value as 'mm' | 'cm' | 'px')}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {spacingUnitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              分类间距: {convertFromPx(style.spacing.categoryGap, spacingUnit)}{spacingUnit === 'mm' ? 'mm' : spacingUnit === 'cm' ? 'cm' : 'px'}
            </label>
            <input
              type="range"
              min={getMinValue(spacingUnit)}
              max={getMaxValue(spacingUnit)}
              step={getStep(spacingUnit)}
              value={convertFromPx(style.spacing.categoryGap, spacingUnit)}
              onChange={(e) => updateStyle({
                spacing: {
                  ...style.spacing,
                  categoryGap: convertToPx(Number(e.target.value), spacingUnit)
                }
              })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              菜品间距: {convertFromPx(style.spacing.dishGap, spacingUnit)}{spacingUnit === 'mm' ? 'mm' : spacingUnit === 'cm' ? 'cm' : 'px'}
            </label>
            <input
              type="range"
              min={getMinValue(spacingUnit)}
              max={getMaxValue(spacingUnit)}
              step={getStep(spacingUnit)}
              value={convertFromPx(style.spacing.dishGap, spacingUnit)}
              onChange={(e) => updateStyle({
                spacing: {
                  ...style.spacing,
                  dishGap: convertToPx(Number(e.target.value), spacingUnit)
                }
              })}
              className="w-full"
            />
          </div>
        </div>
      </div>



      <Modal
        isOpen={showLayoutModal}
        onClose={() => setShowLayoutModal(false)}
        title="选择排版样式"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowLayoutModal(false)}>
              取消
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600 mb-4">点击选择您喜欢的排版样式</p>
        <div className="grid grid-cols-2 gap-4">
          {layoutOptions.map((layout) => (
            <div key={layout.id} className="relative">
              <button
                onClick={() => handleSelectLayout(layout.id)}
                className={`
                  relative rounded-lg overflow-hidden border-2 transition-all w-full
                  ${style.layoutType === layout.id
                    ? 'border-amber-500 ring-2 ring-amber-200'
                    : 'border-gray-200 hover:border-amber-300'
                  }
                `}
              >
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={layout.preview}
                    alt={layout.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowImagePreview(layout.preview);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 bg-white">
                  <div className="font-medium text-gray-900">{layout.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{layout.description}</div>
                </div>
                {style.layoutType === layout.id && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={showImagePreview !== null}
        onClose={() => setShowImagePreview(null)}
        title="背景图片预览"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowImagePreview(null)}>
              关闭
            </Button>
          </div>
        }
      >
        {showImagePreview && (
          <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={showImagePreview}
              alt="背景预览"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <p className="text-sm text-gray-500 text-center mt-3">单击精选背景图片可放大预览</p>
      </Modal>

      <Modal
        isOpen={showMaskPreview !== null}
        onClose={() => setShowMaskPreview(null)}
        title={showMaskPreview?.label || '蒙版效果预览'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowMaskPreview(null)}>
              关闭
            </Button>
          </div>
        }
      >
        {showMaskPreview && (
          <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
            <img
              src={MASK_BASE_IMAGE}
              alt="蒙版预览"
              className={`w-full h-full object-cover ${getMaskStyle(showMaskPreview.mask)}`}
            />
            {getMaskOverlayStyle(showMaskPreview.mask) !== 'transparent' && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: getMaskOverlayStyle(showMaskPreview.mask) }}
              />
            )}
          </div>
        )}
        <p className="text-sm text-gray-500 text-center mt-3">单击蒙版预览图可放大查看效果</p>
      </Modal>



    </div>
  );
};
