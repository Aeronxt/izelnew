import { useState, useRef, useEffect, useContext } from 'react';
import { LangContext } from '../../context/LangContext';
import { useHeader } from '../../context/HeaderContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

const MegaMenu = () => {
  const { lang } = useContext(LangContext);
  const { isTopHeaderVisible } = useHeader();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const menuData = {
    occasions: {
      title: (
        <span className="flex items-center gap-1">
          {lang === 'en' ? 'TRENDING' : 'رائج'}
          <Flame size={16} className="text-red-500" />
        </span>
      ),
      columns: [
        {
          heading: lang === 'en' ? 'New & Popular' : 'جديد ومشهور',
          links: [
            { name: lang === 'en' ? 'New Arrivals' : 'وصل حديثاً', href: '/category/new-arrivals' },
            { name: lang === 'en' ? 'Best Sellers' : 'الأكثر مبيعاً', href: '/category/best-sellers' },
          ]
        },
        {
          heading: lang === 'en' ? 'Style Trends' : 'صيحات الموضة',
          links: [
            { name: lang === 'en' ? 'Western Fusion' : 'مزيج غربي', href: '/category/western-fusion' },
            { name: lang === 'en' ? 'Street Style' : 'ستايل الشارع', href: '/category/street-style' },
          ]
        },
        {
          heading: lang === 'en' ? 'Occasion Wear' : 'ملابس المناسبات',
          links: [
            { name: lang === 'en' ? 'Work-Ready Fits' : 'إطلالات العمل', href: '/category/work-ready' },
            { name: lang === 'en' ? 'Party & Occasion Wear' : 'ملابس الحفلات والمناسبات', href: '/category/party-occasion' },
            { name: lang === 'en' ? 'Holiday Fits' : 'إطلالات العطلات', href: '/category/holiday-fits' },
          ]
        },
        {
          heading: lang === 'en' ? 'Seasonal' : 'موسمي',
          links: [
            { name: lang === 'en' ? 'Summer Essentials' : 'أساسيات الصيف', href: '/category/summer-essentials' },
            { name: lang === 'en' ? 'Casual Fits' : 'إطلالات كاجوال', href: '/category/casual-fits' },
            { name: lang === 'en' ? 'Winter Collection' : 'مجموعة الشتاء', href: '/category/winter-collection' },
          ]
        }
      ]
    },
    clothing: {
      title: lang === 'en' ? 'WOMEN' : 'نسائي',
      columns: [
        {
          heading: lang === 'en' ? 'Tops' : 'البلوزات',
          links: [
            { name: lang === 'en' ? 'All Tops' : 'جميع البلوزات', href: '/category/women-tops' },
          ]
        },
        {
          heading: lang === 'en' ? 'T-shirts' : 'تي شيرت',
          links: [
            { name: lang === 'en' ? 'All T-shirts' : 'جميع التي شيرتات', href: '/category/women-tshirts' },
          ]
        },
        {
          heading: lang === 'en' ? 'Dresses' : 'الفساتين',
          links: [
            { name: lang === 'en' ? 'All Dresses' : 'جميع الفساتين', href: '/category/women-dresses' },
          ]
        },
        {
          heading: lang === 'en' ? 'Bottoms' : 'البناطيل',
          links: [
            { name: lang === 'en' ? 'Jeans & Trousers' : 'جينز وبناطيل', href: '/category/jeans-trousers' },
            { name: lang === 'en' ? 'Skirts & Shorts' : 'تنانير وشورتات', href: '/category/skirts-shorts' },
          ]
        },
        {
          heading: lang === 'en' ? 'Sets & Outerwear' : 'أطقم وملابس خارجية',
          links: [
            { name: lang === 'en' ? 'Co-ords & Jumpsuits' : 'أطقم وجمبسوت', href: '/category/co-ords-jumpsuits' },
            { name: lang === 'en' ? 'Outerwear' : 'الملابس الخارجية', href: '/category/women-outerwear' },
          ]
        }
      ]
    },
    accessories: {
      title: lang === 'en' ? 'MEN' : 'رجالي',
      columns: [
        {
          heading: lang === 'en' ? 'T-Shirts' : 'تي شيرت',
          links: [
            { name: lang === 'en' ? 'All T-Shirts' : 'جميع التي شيرتات', href: '/category/men-tshirts' },
          ]
        },
        {
          heading: lang === 'en' ? 'Shirts' : 'قمصان',
          links: [
            { name: lang === 'en' ? 'Casual Shirts' : 'قمصان كاجوال', href: '/category/casual-shirts' },
            { name: lang === 'en' ? 'Formal Shirts' : 'قمصان رسمية', href: '/category/formal-shirts' },
          ]
        },
        {
          heading: lang === 'en' ? 'Bottoms' : 'البناطيل',
          links: [
            { name: lang === 'en' ? 'Jeans' : 'جينز', href: '/category/men-jeans' },
            { name: lang === 'en' ? 'Joggers' : 'جوجرز', href: '/category/joggers' },
          ]
        },
        {
          heading: lang === 'en' ? 'Outerwear' : 'الملابس الخارجية',
          links: [
            { name: lang === 'en' ? 'Hoodies & Sweatshirts' : 'هوديز وسويتشيرت', href: '/category/hoodies-sweatshirts' },
          ]
        }
      ]
    },
    shoes: {
      title: lang === 'en' ? 'FOR ALL' : 'للجميع',
      columns: [
        {
          heading: lang === 'en' ? 'T-Shirts' : 'تي شيرت',
          links: [
            { name: lang === 'en' ? 'All T-Shirts' : 'جميع التي شيرتات', href: '/category/tshirts' },
            { name: lang === 'en' ? 'Graphic Tees' : 'تي شيرتات برسومات', href: '/category/graphic-tees' },
            { name: lang === 'en' ? 'Basic Tees' : 'تي شيرتات أساسية', href: '/category/basic-tees' },
          ]
        },
        {
          heading: lang === 'en' ? 'Bottoms' : 'البناطيل',
          links: [
            { name: lang === 'en' ? 'Jeans' : 'جينز', href: '/category/jeans' },
            { name: lang === 'en' ? 'Joggers & Pants' : 'جوجرز وبناطيل', href: '/category/joggers-pants' },
          ]
        },
        {
          heading: lang === 'en' ? 'Outerwear' : 'الملابس الخارجية',
          links: [
            { name: lang === 'en' ? 'Jackets' : 'جاكيتات', href: '/category/jackets' },
            { name: lang === 'en' ? 'Hoodies & Sweatshirts' : 'هوديز وسويتشيرت', href: '/category/hoodies-sweatshirts' },
          ]
        },
      ]
    },
    sale: {
      title: lang === 'en' ? 'SALE' : 'تخفيضات',
      href: '/sale'
    }
  };

  const handleMouseEnter = (menuKey) => {
    if (menuKey === 'sale') return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(menuKey);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setIsOpen(false);
    }, 150);
  };

  const handleKeyDown = (event, menuKey) => {
    if (menuKey === 'sale') return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveMenu(activeMenu === menuKey ? null : menuKey);
      setIsOpen(activeMenu !== menuKey);
    } else if (event.key === 'Escape') {
      setActiveMenu(null);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Menu Categories - Inline with header */}
      <ul className="flex items-center justify-center space-x-8">
        {Object.entries(menuData).map(([key, menu]) => (
          <li key={key} className="relative">
            {key === 'sale' ? (
              <Link
                to={menu.href}
                className="text-red-600 hover:text-red-700 font-medium text-sm tracking-wide uppercase transition-colors duration-200"
              >
                {menu.title}
              </Link>
            ) : (
              <button
                className="text-gray-700 hover:text-black font-medium text-sm tracking-wide uppercase transition-colors duration-200 focus:outline-none focus:text-black"
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
                onKeyDown={(e) => handleKeyDown(e, key)}
                aria-haspopup="true"
                aria-expanded={activeMenu === key}
              >
                {menu.title}
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Mega Menu Drawer - Positioned directly below header */}
      <div className={`fixed ${isTopHeaderVisible ? 'top-[136px]' : 'top-[64px]'} left-0 w-full overflow-hidden z-40 transition-all duration-300`}>
        <AnimatePresence>
          {isOpen && activeMenu && menuData[activeMenu] && menuData[activeMenu].columns && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-white shadow-lg border-t border-gray-100"
              onMouseEnter={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="max-w-7xl mx-auto px-4 py-8"
              >
                <div className="flex justify-center space-x-12">
                  {menuData[activeMenu].columns.map((column, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                      className="flex-1 min-w-0"
                    >
                      <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">
                        {column.heading}
                      </h3>
                      <ul className="space-y-2">
                        {column.links.map((link, linkIndex) => (
                          <motion.li
                            key={linkIndex}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.15, delay: 0.15 + linkIndex * 0.02 }}
                          >
                            <Link
                              to={link.href}
                              className="block text-gray-600 hover:text-black text-sm py-1 transition-colors duration-200"
                              onClick={() => {
                                setActiveMenu(null);
                                setIsOpen(false);
                              }}
                            >
                              {link.name}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MegaMenu; 