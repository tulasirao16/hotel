/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import Modal from 'react-modal'
import moment from 'moment'
import 'react-drawer/lib/react-drawer.css'
// import { Tabs, Tab } from 'react-bootstrap-tabs'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import APICallManager from '../../../services/callmanager'
import Pagination from 'react-js-pagination'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    textAlign: 'center'
  }
}
class ADSPBookingsList extends React.Component {
  constructor () {
    super()
    this.state = {
      bookingData: [],
      activePage: 1,
      searchString: '',
      status: 'all',
      totalCountBookings: 0,
      key: 0,
      modalIsOpen: false,
      refundAmount: '',
      confirmCancelModalVisible: false,
      confirmCancelBookingData: {},
      bookedByChecked: 'checked',
      mobileNumberChecked: 'checked',
      emailChecked: 'checked',
      checkInChecked: 'checked',
      checkOutChecked: 'checked',
      noOfRoomsChecked: 'checked',
      propertyTitleChecked: 'checked',
      areaChecked: 'checked',
      bookingCodeChecked: 'checked',
      bookingAmountChecked: 'checked',
      statusChecked: 'checked',
      selectedBooking: {},
      userStatus: false,
      hostData:JSON.parse(localStorage.getItem('hostData')),
      type: localStorage.getItem('bookingStatus'),
      noRefund : false,
      statusCode : ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleAPICall = this.handleAPICall.bind(this)
    this.handleBookingView = this.handleBookingView.bind(this)
    this.handleBookingCancel = this.handleBookingCancel.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirmCancel = this.handleConfirmCancel.bind(this)
    this.closeConfirmModal = this.closeConfirmModal.bind(this)
    this.handleBookingEdit = this.handleBookingEdit.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }

  componentWillMount () {
    this.setState({ bookingCodeChecked: this.state.bookingCodeChecked === 'unchecked' })
    this.setState({ bookedByChecked: this.state.bookedByChecked === 'unchecked' })
    let getAdspBookingsObj = {}
    switch (this.state.type) {
      case 'all':
        this.setState({ heading: 'Booking Amounts' })
        getAdspBookingsObj = {
          url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + this.state.activePage + '/' + this.state.searchString
        }
        break
      case 'actual amount':
        this.setState({ heading: 'actual amount' })
        getAdspBookingsObj = {
          url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + this.state.activePage + '/' + this.state.searchString
        }
        break
      case 'Cancelled':
        this.setState({ heading: 'Cancelled Bookings' })
        getAdspBookingsObj = {
          url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + this.state.activePage + '/' + this.state.searchString
        }
        break
      case 'Expired':
        this.setState({ heading: 'Expired Bookings' })
        getAdspBookingsObj = {
          url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + this.state.activePage + '/' + this.state.searchString
        }
        break
    }
    this.handleAPICall(getAdspBookingsObj)
  }

  handleInputChange (event) {
    this.setState({ activePage: 1 })
    let searchValue = this.state.searchString
    // this.setState({ searchString: event.target.value })
    let getAdspBookingsObj = {}
    switch (this.state.type) {
      case 'all':
        this.setState({ heading: 'Booking Amounts' })
        getAdspBookingsObj = {
          url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + '1' + '/' + searchValue
        }
        break
      case 'actual amount':
        this.setState({ heading: 'actual amount' })
        getAdspBookingsObj = {
          url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + '1' + '/' + searchValue
        }
        break
      case 'Cancelled':
        this.setState({ heading: 'Cancelled bookings ' })
        getAdspBookingsObj = {
          url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + '1' + '/' + searchValue
        }
        break
      case 'Expired':
        this.setState({ heading: 'Expired bookings' })
        getAdspBookingsObj = {
          url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + '1' + '/' + searchValue
        }
        break
    }
    this.handleAPICall(getAdspBookingsObj)
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let getAdspBookingsObj = {}
      switch (this.state.type) {
        case 'all':
          this.setState({ heading: 'Booking Amounts' })
          getAdspBookingsObj = {
            url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + pageNumber + '/' + this.state.searchString
          }
          break
        case 'actual amount':
          this.setState({ heading: 'Bookings' })
          getAdspBookingsObj = {
            url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + pageNumber + '/' + this.state.searchString
          }
          break
        case 'Cancelled':
          this.setState({ heading: 'Cancelled Bookings' })
          getAdspBookingsObj = {
            url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + pageNumber + '/' + this.state.searchString
          }
          break
        case 'Expired':
          this.setState({ heading: 'Expired Bookings' })
          getAdspBookingsObj = {
            url: config.baseUrl + config.getADSPHomeAmountsBookingsListAPI + this.state.hostData._id + '/' + this.state.type + '/' + pageNumber + '/' + this.state.searchString
          }
          break
      }
      this.handleAPICall(getAdspBookingsObj)
    }
  }

  handleAPICall (getAdBookingsObj) {
    let _this = this
    APICallManager.getCall(getAdBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          bookingData: resObj.data.statusResult.bookingsData,
          totalCountBookings: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          bookingData: [],
          totalCountBookings: 0
        })
      }
    })
  }

  handleBack () {
    localStorage.removeItem('bookingStatus')
    hashHistory.push('/admin/host-dashboard')
    event.preventDefault()
  }
  handleHome () {
    localStorage.removeItem('bookingStatus')
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleBookingView (data) {
    localStorage.setItem('bookingsby', 'hostdashboard')
    localStorage.setItem('bookingData', JSON.stringify(data))
    hashHistory.push('/admin/eu/booking-history/view')
    event.preventDefault()
  }
  handleBookingEdit (data) {
    localStorage.setItem('bookingsby', 'hostdashboard')
    localStorage.setItem('bookingData', JSON.stringify(data))
    hashHistory.push('/admin/host/property/bookings-edit')
    event.preventDefault()
  }
  closeModal () {
    this.setState({ modalIsOpen: !this.state.modalIsOpen })
  }

  handleCancel () {
    this.setState({ modalIsOpen: !this.state.modalIsOpen, confirmCancelModalVisible: !this.state.confirmCancelModalVisible })
  }

  closeConfirmModal () {
    this.setState({ confirmCancelModalVisible: !this.state.confirmCancelModalVisible })
  }
  handleBookingCancel (data) {
    this.setState({ selectedBooking: data })
    let getADBookingsObj = {
      url: config.baseUrl + config.getADRefundAmountBookingAPI + data._id + '/' + moment(data.checkInDate).format('YYYY-MM-DD')
    }
    let _this = this
    APICallManager.getCall(getADBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          refundAmount: resObj.data.statusResult.result.totalRefundAmount,
          modalIsOpen: !_this.state.modalIsOpen,
          confirmCancelBookingData: resObj.data.statusResult.result,
          statusCode: resObj.data.statusCode,
          noRefund: true
        })
      } else if (resObj.data.statusCode === '8888') {
        _this.setState({
          refundAmount: 'Are you sure, you want to Cancel this booking on',
          modalIsOpen: !_this.state.modalIsOpen,
          confirmCancelBookingData: resObj.data.statusResult.result,
          noRefund : false,
          statusCode: resObj.data.statusCode
        })
      } else if (resObj.data.statusCode === '7777') {
        _this.setState({
          refundAmount: 'Are you sure, you want to Cancel this booking on',
          modalIsOpen: !_this.state.modalIsOpen,
          confirmCancelBookingData: resObj.data.statusResult.result,
          noRefund : false,
          statusCode: resObj.data.statusCode
        })
      } else {
        ToastsStore.error(t`Sorry! You cant cancel this booking`)
      }
    })
  }
  handleConfirmCancel (statusCode) {
    let bookingListingData = this.state.bookingData
    const index = bookingListingData.findIndex(dataObj => dataObj._id === this.state.selectedBooking._id)
    let _this = this
    switch (statusCode) {
      case '0000' :
        let cancelObj = {
          bookingId: _this.state.selectedBooking._id,
          appRefundAmount: _this.state.confirmCancelBookingData.appRefundAmount,
          spRefundAmount: _this.state.confirmCancelBookingData.spRefundAmount,
          totalRefundAmount: _this.state.confirmCancelBookingData.totalRefundAmount,
          statusCode: '0000'
        }
        let obj = { url: config.baseUrl + config.putADConfirmCancelBookingAPI, body: cancelObj }
        APICallManager.putCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            bookingListingData[index].appRefundAmount = _this.state.confirmCancelBookingData.appRefundAmount
            bookingListingData[index].spRefundAmount = _this.state.confirmCancelBookingData.spRefundAmount
            bookingListingData[index].totalRefundAmount = _this.state.confirmCancelBookingData.totalRefundAmount
            bookingListingData[index].bookingStatus = 'Cancelled'
            _this.setState({ confirmCancelModalVisible: !_this.state.confirmCancelModalVisible, bookingData: bookingListingData })
            ToastsStore.success('Booking Cancellation Successful')
          } else {
            ToastsStore.error('Booking Cancellation Failed')
          }
        })
        break
      case '8888' :
        let cancelNoRefundObj = {
          bookingId: _this.state.selectedBooking._id,
          appRefundAmount: 0,
          spRefundAmount: 0,
          totalRefundAmount: 0,
          statusCode: '8888'
        }
        let noRefundObj = { url: config.baseUrl + config.putADConfirmCancelBookingAPI, body: cancelNoRefundObj }
        APICallManager.putCall(noRefundObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            bookingListingData[index].appRefundAmount = 0
            bookingListingData[index].spRefundAmount = 0
            bookingListingData[index].totalRefundAmount = 0
            bookingListingData[index].bookingStatus = 'Cancelled'
            _this.setState({ confirmCancelModalVisible: !_this.state.confirmCancelModalVisible, bookingData: bookingListingData })
            ToastsStore.success('Booking Cancellation Successful')
          } else {
            ToastsStore.error('Booking Cancellation Failed')
          }
        })
        break
      case '7777' :
        let paymentStatusPendingCancelObj = {
          bookingId: _this.state.selectedBooking._id,
          statusCode: '7777'

        }
        let paymentStatusPendingCancel = { url: config.baseUrl + config.putADConfirmCancelBookingAPI, body: paymentStatusPendingCancelObj }
        APICallManager.putCall(paymentStatusPendingCancel, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            bookingListingData[index].bookingStatus = 'Cancelled'
            _this.setState({ confirmCancelModalVisible: !_this.state.confirmCancelModalVisible, bookingData: bookingListingData })
            ToastsStore.success('Booking Cancellation Successful')
          } else {
            ToastsStore.error('Booking Cancellation Failed')
          }
        })
        break
      default :
        ToastsStore.warning('Please TryAgain')
    }
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  {/* <button className='btn btn-primary mb-0' onClick={this.handleBack}>{t`lanCommonButtonBack`}</button> */}
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>{t`lanADLabelDashboardHostDashboard`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanADLabelDashboardBookingsList`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header mb-0'>
                  <div className='row'>
                    <div className='col-md-7 col-7'>
                      <h5 className='card-title pt-1'>{t`lanADLabelDashboardBookings`}</h5>
                    </div>
                    <div className='col-md-5 col-5 text-right'>
                      <div className='row'>
                        <div className='col-md-3'>
                          <div className='button-group'>
                            <button title='Table Filter' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                            <ul className='dropdown-menu'>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                bookedByChecked: this.state.bookedByChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.bookedByChecked} />{t`lanCommonLabelBookedBy`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                mobileNumberChecked: this.state.mobileNumberChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.mobileNumberChecked} />{t`lanCommonLabelMobileNumber`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                emailChecked: this.state.emailChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.emailChecked} />{t`lanCommonLabelEmail`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                checkInChecked: this.state.checkInChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.checkInChecked} />{t`lanCommonLabelCheckIn`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                checkOutChecked: this.state.checkOutChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.checkOutChecked} />{t`lanCommonLabelCheckOut`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                noOfRoomsChecked: this.state.noOfRoomsChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.noOfRoomsChecked} />{t`lanCommonLabelNumberOfRooms`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                propertyTitleChecked: this.state.propertyTitleChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.propertyTitleChecked} />{t`lanCommonLabelPropertyTitle`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                areaChecked: this.state.areaChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.areaChecked} />{t`lanCommonLabelArea`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                bookingCodeChecked: this.state.bookingCodeChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.bookingCodeChecked} />{t`lanCommonLabelBookingCode`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                bookingAmountChecked: this.state.bookingAmountChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.bookingAmountChecked} />{t`lanCommonLabelBookingAmount`}</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({
                                statusChecked: this.state.statusChecked === 'checked' ? ''
                                  : 'checked'
                              })} checked={this.state.statusChecked} />{t`lanCommonLabelStatus`}</a></li>
                              <li><a><input type='checkbox' checked={this.state.actionsChecked} />{t`lanCommonLabelActions`}</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className='col-md-7 pr-0'>
                          {/* -- Search form -- */}
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString}
                                  onChange={(e) => { this.setState({ searchString: e.target.value }) }} onKeyPress={this.handleEnter} />
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className='col-md-2 pl-0'>
                          <button className='btn btn-icon btn-primary px-3 py-2' type='button' onClick={this.handleInputChange}>
                            <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-body bookings'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {this.state.bookingData.length > 0
                          ? <div>
                            <div className='table-responsive'>
                              <table className='table align-items-center table-flush table-striped'>
                                <thead className='thead-light'>
                                  <tr>
                                    {this.state.bookedByChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelBookedBy`}</th> : null}
                                    {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelMobileNumber`}</th> : null}
                                    {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelEmail`}</th> : null}
                                    {this.state.checkInChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelCheckIn`}</th> : null}
                                    {this.state.checkOutChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelCheckOut`}</th> : null}
                                    {this.state.noOfRoomsChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelNumberOfRooms`}</th> : null}
                                    {this.state.propertyTitleChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelPropertyTitle`}</th> : null}
                                    {this.state.areaChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelArea`}</th> : null}
                                    {this.state.bookingCodeChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelBookingCode`}</th> : null}
                                    {this.state.bookingAmountChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelBookingAmount`}</th> : null}
                                    {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelStatus`}</th> : null}
                                    <th className='sort' data-sort='name'>{t`lanCommonLabelActions`}</th>
                                  </tr>
                                </thead>
                                {
                                  this.state.bookingData.map((item, i) =>
                                    <tbody key={i}>
                                      <tr>
                                        {this.state.bookedByChecked ? <td className='text-muted'>{item.euName}</td> : null}
                                        {this.state.mobileNumberChecked ? <td className='text-muted'>{item.euMobileNumber}</td> : null}
                                        {this.state.emailChecked ? <td className='text-muted'>{item.euEmail}</td> : null}
                                        {this.state.checkInChecked ? <td className='text-muted'>{moment(item.checkInDate).format('MMM DD,YY(hh:mm A)')}</td> : null}
                                        {this.state.checkOutChecked ? <td className='text-muted'>{moment(item.checkOutDate).format('MMM DD,YY(hh:mm A)')}</td> : null}
                                        {this.state.noOfRoomsChecked ? <td className='text-muted'>{item.noOfRooms}</td> : null}
                                        {this.state.propertyTitleChecked ? <td className='text-muted'>{item.spPropertyTitle}</td> : null}
                                        {this.state.areaChecked ? <td className='text-muted'>{item.spLocationObj.area}</td> : null}
                                        {this.state.bookingCodeChecked ? <td className='text-muted'>{item.bookingCode}</td> : null}
                                        {this.state.bookingAmountChecked ? <td className='text-muted'>{item.spTotalAmount}</td> : null}
                                        {this.state.statusChecked ? <td className='text-muted'>{item.bookingStatus}</td> : null}
                                        <td className='table-actions'>
                                          {item.status === 'Booked'
                                            ? <span className='badge badge-dot mr-4'>
                                              <i className='bg-warning' />
                                              <span className='status'>{item.status}</span>
                                            </span>
                                            : item.status === 'Completed'
                                              ? <span className='badge badge-dot mr-4'>
                                                <i className='bg-success' />
                                                <span className='status'>{item.status}</span>
                                              </span>
                                              : item.status === 'Cancelled'
                                                ? <span className='badge badge-dot mr-4'>
                                                  <i className='bg-danger' />
                                                  <span className='status'>{item.status}</span>
                                                </span>
                                                : ''}
                                          <span className='text-muted'>{item.location} </span>
                                          <span className='text-muted'>{item.hotel} </span>
                                          <div className='table-actions btn-actions'>
                                            <a onClick={() => this.handleBookingView(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top'
                                              title={t`lanCommonButtonTooltipViewBooking`}>
                                              <i className='far fa-eye' />
                                            </a>
                                            <a onClick={() => this.handleBookingEdit(item)} className='table-action table-action-edit' data-toggle='tooltip' data-placement='top'
                                              title={t`lanCommonButtonTooltipEditBooking`}>
                                              <i className='far fa-edit' />
                                            </a>
                                            {item.bookingStatus === 'Booked' || item.bookingStatus === 'Confirmed'
                                              ? <a onClick={() => this.handleBookingCancel(item)} className='table-action table-action-cancel' data-toggle='tooltip' data-placement='top'
                                                title={t`lanCommonButtonTooltipCancelBooking`}>
                                                <i className='fas fa-times' />
                                              </a> : ''}
                                            {/* {item.bookingStatus === 'Completed'
                                              ? <a onClick={this.handleBookingReview} className='table-action table-action-review' data-toggle='tooltip' data-placement='top' title={t`lanCommonButtonTooltipReviews`}>
                                                <i className='fas fa-star' />
                                              </a> : '' } */}
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  )}
                              </table>
                            </div>
                          </div> : this.state.bookingData.length <= 0 ? <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div> : null
                        }
                        {/* <div className='card-footer text-center'>
                          <button className='btn btn-primary mb-0' onClick={this.handleBack}>{ t`lanCommonButtonBack` }</button>
                        </div> */}
                      </div>
                    </div>
                    <Modal
                      isOpen={this.state.modalIsOpen}
                      style={customStyles}
                      ariaHideApp={false}
                    >
                      {this.state.noRefund
                      ? <p>Total Amount of {this.state.refundAmount} Will Be Refunded To The Customer {this.state.selectedBooking.euName} With Booking ID: {this.state.selectedBooking.bookingCode}</p>
                      : <p> Are you sure, you want to Cancel this booking on With Booking ID: {this.state.selectedBooking.bookingCode}</p>}
                      {/* <p>
                        {t`lanADLabelDashboardTotalAmountOf`} {this.state.refundAmount} {t`lanADLabelDashboardWillBeRefundedToTheCustomer`}
                        {this.state.selectedBooking.euName} {t`lanADLabelDashboardWithBookingId`}: {this.state.selectedBooking.bookingCode}
                      </p> */}
                      <button className='btn btn-primary mr-2' onClick={this.handleCancel}>{t`lanCommonButtonOkay`}</button>
                      <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonBack`}</button>
                    </Modal>
                    <Modal
                      isOpen={this.state.confirmCancelModalVisible}
                      style={customStyles}
                      ariaHideApp={false}
                    >
                      <p>{t`lanADLabelDashboardAreYouSureYouWantToCancelThisBookingOn`} {moment(this.state.selectedBooking.checkInDate).format('MMM DD, YY')} -
                        {moment(this.state.selectedBooking.checkOutDate).format('MMM DD, YY')}?</p>
                      <button className='btn btn-primary mr-2' onClick={() => this.handleConfirmCancel(this.state.statusCode)}>{t`lanCommonButtonYes`}</button>
                      <button className='btn btn-danger' onClick={this.closeConfirmModal}>{t`lanCommonButtonNo`}</button>
                    </Modal>
                  </section>
                </div>
                <div className='card-footer'>
                  <div className='text-center'>
                    {this.state.totalCountBookings
                    ? <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={10}
                      totalItemsCount={this.state.totalCountBookings}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                    />
                  : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
        </div>
      </div>
    )
  }
}

export default ADSPBookingsList
