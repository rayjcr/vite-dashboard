import { useEffect, useRef, useCallback } from "react";

export function getGlobalState() {
  const device = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent) ? 'MOBILE' : 'DESKTOP';
  const collapsed = device !== 'DESKTOP';
  // 主题配色也可以考虑放在这里 defaultSettings 返回一个 primaryColor
  return {
    device,
    collapsed,
  }
}

export function getLocale() {
  return localStorage.getItem('locale')
  || (navigator.languages && navigator.languages[0])
  || navigator.language || 'en-us'
}

export function vaildChineseCharacter(event) {
  return event.target.value.replace(/[\u4e00-\u9fa5]/g,'');
}

// 防抖动
export function useDebounce(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(() => {
    current.fn = fn;
  }, [current, current.fn, fn]);

  return useCallback((...args) => {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, delay);
  }, [current, delay])
}

export function formatMoney(total, currency){
  let _total;
  //   console.log(currency, total, '56')
  if(!currency || !total) return 0

  if (!['KRW','JPY','IDR'].includes(currency)) {
    total = total / 100;
  }
  // if(!['KRW', 'JPY'].includes(currency)){
  //     s=(s/100).toFixed(2)
  // }
  if(currency.split(',').length>1) return total;

  return new Intl.NumberFormat('en-US',{
      style: 'currency', 
      currency, 
  }).format(total);
}