import React, { useState, useEffect, memo } from 'react'

import { Radio, Table, Tag } from 'antd'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { connect } from 'react-redux'
import { reject, filter, find, update, cloneDeep } from 'lodash'
import css from './merchant.module.scss'
import { formatMoney } from '@/utils/tool'
import { getSummaryList, getColumns, getTransactionsList } from '@/api/transactions'

const TabList = [
  {
      key: 'daily',
      title: 'Daily Summary',
      configName: 'daily_summary_disable',
  },{
      key: 'monthly',
      title: 'Monthly Summary',
      configName: 'monthly_summary_disable',
  },{
      key: 'lookup',
      title: 'Transaction Lookup',
      configName: 'transactions_lookup_disable',
  },{
      key: 'daily_settle',
      title: 'Daily Settle Summary',
      configName: 'daily_settle_summary_disable',
  },{
      key: 'daily_dispute',
      title: 'Dispute Summary',
      configName: 'daily_dispute_summary_disable',
  },
]

const Merchant = memo(({app, global}) => {
  const { user } = app; 
  const { formatMessage } = useIntl()  
  
  const { mid } = useParams();
  const [isElavonSite, setIsElavonSite] = useState(false) //!!! is into MerchantSetting 
  const [cusColumns, setCusColumns] = useState([]) // current table header
  const [detailProps, setDetailProps] = useState({show: false}) // show summary detail layer compontent's props
  const [searchType, setSearchType] = useState('daily') // tab name
  const [hasDispute, setHasDispute] = useState(false)  //!!! is into MerchantSetting
  const [tabs, setTabs] = useState(TabList) // current tabs by merchant_id 
  const [dataList, setDataList] = useState([]) // current display data list
  const [loading, setLoading] = useState(false)
  const [merchantSetting, setMerchantSetting] = useState({}) // Maintain uniform merchant Settings.
  
  const [pagination, setPagination] = useState({
    pageSize: 10,
    total: 0,
    current: 1,
    pageSizeOptions:[10,20,50],
    showSizeChanger: true
  })

  const DailyColumns = [
    {
      title: formatMessage({id: 'table.th.date'}),
      // dataIndex: 'date_month',
      textWrap: 'word-break',
      key: 'date_month',
      width: searchType==='monthly' ? '100px' : '250px',
      render: (row) => {
        if(mid){
            return <span className='linkSpan' onClick={()=>showDetail(row)}>{row.date_month}</span>
        }else{
          return row.date_month
        }
      },
      fixed: 'left',
    },{
      title: formatMessage({id: 'table.th.totalTranx'}),
      dataIndex: 'num_tran',
      width:'100px',
      align: 'center',
    },{
      title: formatMessage({id: 'table.th.gross'}),
      width:'170px',
      render: ({ currency, gross }) => {
        return `${formatMoney((gross).toFixed(2), currency)}`;
      },
    },{
      title: formatMessage({id: 'table.th.net'}),
      width:'170px',
      render: ({ currency, net }) => {
        return `${formatMoney((net).toFixed(2), currency)}`;
      },
    },{
      title: formatMessage({id: 'table.th.status'}),
      render: ({status, settle_date}) => {
        return status==='pending' ? <Tag color="#2db7f5">ACH {status}</Tag> : <Tag color="#87d068">ACH{status} {settle_date}</Tag>
      },
      disableDependency: ['monthly'],
      width:'200px',
    },{
      title: formatMessage({id: 'table.th.paymentMethods'}),
      dataIndex: 'vendor',
      width: '250px'
    }
  ];

  const LookupColumns = [
    {
        title: 'Location',
        dataIndex: 'location',
        width:'150px',
    },{
        title: 'Store Name',
        dataIndex: 'store_name',
        width:'150px',
    },{
        title: 'Transaction ID',
        dataIndex: 'transaction_id',
        width:'150px',
    },{
        title: 'Parent Transaction ID',
        dataIndex: 'parent_transaction_id',
        width:'150px',
    },{
        title: 'Reference ID',
        db_column_name: 'reference',
        dataIndex: 'reference',
        width:'150px',
        disabled: true,
    },{
        title: 'Reference ID',
        db_column_name: 'reference2',
        dataIndex: 'reference2',
        width:'150px',
        disabled: true,
    },{
        title: 'Reference ID',
        db_column_name: 'extral_reference',
        dataIndex: 'extral_reference',
        width:'150px',
        disabled: true,
    },{
        title: 'Date/Time',
        dataIndex: 'time_created',
        width:'380px',
    },{
        title: 'Transaction Type',
        dataIndex: 'transaction_type',
        width:'150px',
    },{
        title: 'tranx status',
        db_column_name: 'tranx_status',
        dataIndex: 'tranx_status',
        width: '100px',
        disabled: true,
    },{
        title: 'Payment Method',
        dataIndex: 'payment_method',
        width:'150px',
    },{
        title: 'Payment gateway',
        db_column_name: 'payment_gateway',
        dataIndex: 'payment_gateway',
        width: '100px',
        disabled: true,
    },{
        title: 'Card Number',
        dataIndex: 'buyer_id',
        width:'150px',
    },{
        title: 'Vendor Reference',
        dataIndex: 'method_trans_id',
        width:'150px',
    },{
        title: 'Auth Currency',
        db_column_name: 'auth_currency',
        width: '100px',
        dataIndex: 'auth_currency',
        disabled: true,
    },{
        title: 'Total',
        width:'150px',
        render: ({ currency, total }) => {
            return `${formatMoney((total).toFixed(2), currency)}`
        }
    },{
        title: 'Auth Amount',
        db_column_name: 'auth_amount',
        render: ({ currency, auth_amount }) => {
            return `${formatMoney((auth_amount).toFixed(2), currency)}`
        },
        width: '150px',
        disabled: true,
    },{
        title: 'Action',
        width:'150px',
    },{
        title: 'Amount Captured',
        db_column_name: 'amount_captured',
        render: ({ currency, amount_captured }) => {
            return `${formatMoney((amount_captured).toFixed(2), currency)}`
        },
        width: '150px',
        disabled: true,
    },{
        title: 'Sales',
        width:'150px',
        render: ({ currency, sales }) => {
            return `${formatMoney((sales).toFixed(2), currency)}`
        }
    },{
        title: 'Tip',
        width:'150px',
        render: ({ currency, tip }) => {
            return `${formatMoney(((tip| 0)).toFixed(2), currency)}`
        }
    },{
        title: 'Login Code',
        dataIndex: 'login_code',
        width:'150px',
    },{
        title: 'Dispute Tag',
        dataIndex: 'transaction_tag',
        width:'150px',
    },{
        title: 'Transaction Tag',
        dataIndex: 'transaction_tag',
        width:'150px',
    },{
        title: 'Terminal ID',
        dataIndex: 'terminal_id',
        width:'150px',
    },{
        title: 'Store of Original Payment',
        dataIndex: 'original_merchant_name_english',
        width:'155px',
    }
  ];

  const [columns, setColumns] = useState(DailyColumns)

  const computeWidth = () => {
    if (searchType==='lookup') {
      return 3000
    } else {
      return columns.reduce((num, item) => {
        return num += parseInt(item.disabled ? 0 : item.width||0)
      },0)
    }
  }

  const tableProps = {
    columns: reject(columns, (o) => {
      return o.disableDependency?.includes(searchType) || o.disabled
    }),
    loading: loading,
    dataSource: dataList,
    pagination: pagination,
    size: 'small',
    rowKey: (record) => {
      return record.date_month || record.transaction_id;
    },
    onChange: (pageObj) => {
      setPagination({
        ...pagination, 
        current: pageObj.current,
        pageSize: pageObj.pageSize
      })
    },
    scroll: {
        // x: searchType==='lookup'? 3000 : 1000,
      x: computeWidth(),
    },
  }

  const disabledColumns = (disabledArr, columns) => {
    let changeItem = [];
    changeItem = filter(columns, (o)=>{
      return disabledArr.includes(o.title)
    });
    changeItem.forEach(item=>{
      update(item, 'disabled', (e)=>true);
    })
  }

  const displayAndModifyColumns = (showColumns, columns) => {
    filter(columns, (o)=>{
      let cItem = find(showColumns, {db_column_name: o.db_column_name})
      if(cItem){
        o.disabled = false;
        o.title = cItem.ui_column_name;
      }
      return true
    });
  }

  const checkColumns = (isElav, columns) => {
    switch (searchType) {
      case 'daily':
        if(isElav){
          disabledColumns(['Net'], columns);
        }
        if(!mid){
          disabledColumns(['Status','Payment Methods'], columns);
        }
        break;
      case 'monthly':
        if(!mid){
          disabledColumns(['Status','Payment Methods'], columns);
        }
        break;
      case 'lookup':
        let showColumns = filter(cusColumns, {is_shown: 1})
        displayAndModifyColumns(showColumns, columns)
        break
      default:
        break
    }
  }

  const getColumnsByMid = async () => {
    let params = {
      merchantId: mid,
      session_id: user.session_id,
    }
    let { data } = await getColumns(params)
    setCusColumns(data.data);
  }

  const getTransactions = async () => {
    setLoading(true)
    let params = {
      startDate: "",
      endDate: "",
      hierarchy: user.hierarchy,
      merchantId: mid,
      pageNumber: pagination.current-1,
      rowCount: pagination.pageSize,
      searchKey: '',
      selectedMid: sessionStorage.getItem('curNode'),
      sessionId: user.session_id
    }
    let { data } = await getTransactionsList(params);
    console.log(data, 'lookup-data-line-167')
    checkColumns(false, LookupColumns)
    batchedUpdates(()=>{
      setPagination({...pagination, total: parseInt(data.totalRecords)})
      setDataList(data.transactions)
      setColumns(LookupColumns)
      setLoading(false)
    })
  }

  const getSummary = async () => {
    setLoading(true)
    let params = {
      date_month: '',
      hierarchy_user_id: sessionStorage.getItem('curNode'),
      merchantId: mid || '',
      page_number: pagination.current-1,
      row_count: pagination.pageSize,
      search_type: searchType,
      session_id: user.session_id
    }
    let { data } = await getSummaryList(params);

    checkColumns(data.isElavonSite?true:false, DailyColumns);
    
    batchedUpdates(async ()=>{
      setIsElavonSite(data.isElavonSite?true:false)
      setMerchantSetting({
        ...merchantSetting,
        isElavonSite: data.isElavonSite,
      })
      setPagination({...pagination, total: data.total_records})
      setHasDispute(data.hasDisputeChild)
      setDataList(data.transactions)
      setColumns(DailyColumns);
      setLoading(false)
    })
  }

  const changeType = (event) => {
    batchedUpdates(()=>{
      setPagination({...pagination, current: 1})
      setSearchType(event.target.value)
    })
  }

  const getUserConfig = (userConfig, prop) => {
    if( userConfig == null || userConfig[prop] == null ) {
        if(prop == "daily_settle_summary_disable") {
          return false;
        } else {
          return true;
        }
    } else {
         return !userConfig[prop];
    }
  }

  // reset table columns th for change language. reset table columns
  useEffect(() => {
    let _tempColumns;
    switch (searchType) {
      case 'daily':
      case 'monthly':
        _tempColumns = cloneDeep(DailyColumns)
        break
      case 'lookup':
        _tempColumns = cloneDeep(LookupColumns)
        break
      default:
        break
    }

    checkColumns(isElavonSite, _tempColumns);
    setColumns([..._tempColumns])

    // setColumns([...columns])

  }, [global])

  useEffect(()=>{
    let _TabList = cloneDeep(TabList);
    if(!hasDispute || !getUserConfig(JSON.parse(user.config), 'daily_dispute_summary_disable')) {
      _TabList = reject(_TabList, {key: 'daily_dispute'})
    }
    

    if(!mid) {
      setTabs([...reject(_TabList, (item)=>{
        return ['lookup', 'daily_settle'].includes(item.key)
      })])
    } else {
      setTabs([..._TabList])
    }
  }, [hasDispute])
  
  useEffect(() => {
    if(['daily','monthly'].includes(searchType)) {
      getSummary()
    } else if(['lookup'].includes(searchType)) {
      getColumnsByMid()
      getTransactions()
    }
    // console.log(user, 'user')
    // console.log(searchType, 'aaaaaaa')
  }, [pagination.current, pagination.pageSize, searchType, mid])
  
  return (
     <div className={css.posMain}>
      <div>
        <Radio.Group className={css.TabGroup} value={searchType} onChange={(e)=>changeType(e)} buttonStyle='solid'>
          {tabs.map(item => {
            return <Radio.Button key={item.key} value={item.key}>{item.title}</Radio.Button>
          })}
        </Radio.Group>
        <div className={css.summaryTable}>
          <div className={css.summaryTitle}>{searchType} summary</div>
          <Table {...tableProps} />
        </div>
      </div>
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app, global } =  state
  return { app, global }
}

export default connect(mapStateToProps)(Merchant)