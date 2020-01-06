/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
// import APICallManager from '../../../services/callmanager'
// import { t } from 'ttag'
import '../home/Css/EULandingPage.css'
import '../../../css/carousel.css'
import '../../../css/theme.min.css'
import './css/HeaderStyles.css'
import PropTypes from 'prop-types'
import config from '../../../../public/config.json'
import ReactDrawer from 'react-drawer'
import axios from 'axios'
import classnames from 'classnames'
import { saveLocale } from '../../../i18nInit'
import APICallManager from '../../../services/callmanager'
import { t } from 'ttag'

const myApi = axios.create()
const setLocale = (locale) => (ev) => {
  ev.preventDefault()
  saveLocale(locale)
  window.location.reload()
}
class MainHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      location: this.props.location ? this.props.location : '',
      startDate: new Date(),
      isOpen: true,
      hidden: false,
      predictions: [],
      isEnable: false,
      open: false,
      position: 'left',
      menuItem: 'Home',
      noOverlay: true,
      isUserLogedin: false,
      notificationsUnReadCount: 0
    }
    this.handleBecomeHost = this.handleBecomeHost.bind(this)
    this.handleAllHotelsList = this.handleAllHotelsList.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleEnduserSignup = this.handleEnduserSignup.bind(this)
    this.handleEndUserLogin = this.handleEndUserLogin.bind(this)
    this.handleEndUserHome = this.handleEndUserHome.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleLocationData = this.handleLocationData.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onDrawerClose = this.onDrawerClose.bind(this)
    this.handleHomePage = this.handleHomePage.bind(this)
    this.handleEUInbox = this.handleEUInbox.bind(this)
    this.handleEUBookings = this.handleEUBookings.bind(this)
    this.handleEUReviews = this.handleEUReviews.bind(this)
    this.handleEUNotifications = this.handleEUNotifications.bind(this)
    this.handleFavourites = this.handleFavourites.bind(this)
    this.handleSupport = this.handleSupport.bind(this)
    this.handleEUProfile = this.handleEUProfile.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleHostLogin = this.handleHostLogin.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }
  componentWillMount () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      this.setState({ menuItem: localStorage.getItem('menuItem') })
      window.addEventListener('scroll', this.handleScroll)
      let authObj = JSON.parse(localStorage.getItem('authObj'))
      if (authObj && authObj.preferences) {
        this.setState({ authObj: authObj, isUserLogedin: true })
      }
      if (this.props.navRoute !== 'notifications') {
        let obj = { url: config.baseUrl + config.getEUNotificationsUnReadCount }
        let _this = this
        APICallManager.getCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({ notificationsUnReadCount: resObj.data.statusResult })
          } else {
            _this.setState({ notificationsUnReadCount: 0 })
          }
        })
      }
    } else {
      hashHistory.push('/')
    }
  }
  componentWillReceiveProps (newProps) {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.setState({ authObj: authObj })
    this.setState({ location: newProps.location })
    if (newProps.navRoute !== 'notifications') {
      let obj = { url: config.baseUrl + config.getEUNotificationsUnReadCount }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ notificationsUnReadCount: resObj.data.statusResult })
        } else {
          _this.setState({ notificationsUnReadCount: 0 })
        }
      })
    }
  }
  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
  }
  handleClickOutside (event) {
    this.setState({ open: false })
  }
  handleHostLogin () {
    hashHistory.push('/host/signin')
    event.preventDefault()
  }
  handleBecomeHost () {
    hashHistory.push('/host')
    event.preventDefault()
  }
  handleAllHotelsList () {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleChange (event) {
    this.setState({ location: event.target.value, startDate: event.target.value })
  }
  handleDateChange (date) {
    this.setState({
      startDate: date
    })
  }

  handleEnduserSignup (e) {
    hashHistory.push('/signup')
    e.preventDefault()
  }

  handleEndUserLogin (e) {
    hashHistory.push('/login')
    e.preventDefault()
  }
  handleEndUserHome () {
    hashHistory.push('/')
    event.preventDefault()
  }
  async handleSearchChange (event) {
    let destination = event.target.value
    if (event.target.value.trim().length) {
      this.setState({
        isEnable: true, location: destination, destination: destination
      })
      const apiurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${config.googleMapsAPIKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`
      try {
        const result = await fetch(config.corsUrl + apiurl)
        const json = await result.json()
        this.setState({
          predictions: json.predictions
        })
      } catch (err) {
        console.log('===Error:', err)
      }
    } else {
      this.setState({
        isEnable: false, location: destination, destination: destination
      })
    }
  }
  async handleLocationData (description) {
    this.setState({
      isEnable: false,
      destination: description
    })
    let _this = this
    const apiurl = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.googleMapsAPIKey}&address=${description}`
    try {
      const result = await fetch(apiurl)
      const json = await result.json()
      _this.setState({
        latitude: json.results[0].geometry.location.lat,
        longitude: json.results[0].geometry.location.lng
      })
      this.props.getAddressComponents(json.results[0].geometry.location.lat, json.results[0].geometry.location.lng)
    } catch (err) {
      console.log('===Error:', err)
    }
  }
  toggleDrawer () {
    this.setState({ open: !this.state.open })
  }
  closeDrawer () {
    this.setState({ open: false })
  }
  onDrawerClose () {
    this.setState({ open: false })
  }
  handleHomePage () {
    localStorage.setItem('menuItem', 'Home')
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleEUInbox () {
    localStorage.setItem('menuItem', 'Inbox')
    hashHistory.push('/inbox-list')
    event.preventDefault()
  }
  handleEUBookings () {
    localStorage.setItem('menuItem', 'Bookings')
    hashHistory.push('/bookings')
    event.preventDefault()
  }
  handleEUReviews () {
    localStorage.setItem('menuItem', 'Reviews')
    hashHistory.push('/reviewratings')
    event.preventDefault()
  }
  handleEUNotifications (event) {
    localStorage.setItem('menuItem', 'Notifications')
    if (this.props.drawerValue === 'notifications') {
      this.setState({ open: false })
    } else {
      hashHistory.push('/notifications-list')
    }
    event.preventDefault()
  }
  handleFavourites () {
    localStorage.setItem('menuItem', 'Favourites')
    hashHistory.push('/favourites')
    event.preventDefault()
  }
  handleEUProfile () {
    localStorage.setItem('menuItem', 'Profile')
    hashHistory.push('/profile')
    event.preventDefault()
  }
  handleSupport () {
    localStorage.setItem('menuItem', 'Support')
    hashHistory.push('/support')
    event.preventDefault()
  }
  handleLogout () {
    localStorage.clear()
    myApi.defaults.headers.token = null
    hashHistory.push('/login')
    event.preventDefault()
  }
  handleNotifications () {
    hashHistory.push('/notifications-list')
    event.preventDefault()
  }

  render () {
    return (
      <div className='eu-header'>
        <ReactDrawer
          open={this.state.open}
          position={this.state.position}
          onClose={this.onDrawerClose}
          noOverlay={this.state.noOverlay}>
          <div className='close-drawer'>
            <span onClick={this.closeDrawer} className=''> <i className='fas fa-times' /> </span>
          </div>
          <nav className='sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white' id='sidenav-main'>
            <div className='scrollbar-inner'>
              <div className='navbar-inner'>
                {/* Collapse */}
                <div className='collapse navbar-collapse' id='sidenav-collapse-main'>
                  {/* Nav items */}
                  <ul className='navbar-nav'>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Home' })} onClick={this.handleHomePage}>
                        {/* <a className='nav-link' onClick={this.handleHomePage} > */}
                        <i className='fas fa-home text-primary' />
                        <span className='nav-link-text'>{ t`lanEUButtonHome` }</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Inbox' })} onClick={this.handleEUInbox}>
                        {/* <a className='nav-link' onClick={this.handleEUInbox} > */}
                        <i className='ni ni-email-83 text-green' />
                        <span className='nav-link-text'>{ t`lanEUButtonInbox` }</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Bookings' })} onClick={this.handleEUBookings}>
                        {/* <a className='nav-link' onClick={this.handleEUBookings} > */}
                        <i className='ni ni-bullet-list-67 text-info' />
                        <span className='nav-link-text'>{ t`lanEUButtonBookings` }</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Reviews' })} onClick={this.handleEUReviews}>
                        {/* <a className='nav-link' onClick={this.handleEUReviews} > */}
                        <i className='far fa-star text-primary' />
                        <span className='nav-link-text'>{ t`lanEUButtonRatings&Reviews` }</span>
                      </a>
                    </li>
                    {/* <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Notifications' })} onClick={this.handleEUNotifications}>
                        <i className='far fa-bell text-green' />
                        <span className='nav-link-text'>Notifications</span>
                        <span className='badge badge-md badge-circle badge-floating badge-danger border-white'>{this.state.notificationUnReadCount}</span>
                      </a>
                    </li> */}
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Favourites' })} onClick={this.handleFavourites}>
                        {/* <a className='nav-link' onClick={this.handleFavourites} > */}
                        <i className='far fa-heart text-red' />
                        <span className='nav-link-text'>{ t`lanEUButtonFavourites` }</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Profile' })} onClick={this.handleEUProfile}>
                        {/* <a className='nav-link' onClick={this.handleEUProfile} > */}
                        <i className='ni ni-circle-08 text-primary' />
                        <span className='nav-link-text'>{ t`lanEUButtonProfile` }</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Support' })} onClick={this.handleSupport}>
                        {/* <a className='nav-link' onClick={this.handleSupport}> */}
                        <i className='ni ni-headphones text-info' />
                        <span className='nav-link-text'>{ t`lanEUButtonSupport` }</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleLogout} >
                        <i className='ni ni-button-power text-red' />
                        <span className='nav-link-text'>{ t`lanEUButtonLogOut` }</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </ReactDrawer>
        <nav id='navbar-main' className='navbar navbar-horizontal navbar-transparent navbar-main navbar-expand-lg navbar-light'>
          <div className='container-fluid'>
            <a onClick={this.handleEndUserHome} >
              <div className='logo-text'>
                <img src={require('../../../../assets/logo-white.png')} className='logo-image' />
                {/* <h1>AM to PM</h1> */}
              </div>
            </a>
            {this.state.isUserLogedin
              ? <div>
                <button
                  className='drawerTogglebtn'
                  onClick={this.toggleDrawer}
                  disabled={this.state.open && !this.state.noOverlay}
                  >
                  {!this.state.open ? <span><i className='fas fa-bars' /></span> : <span><i className='fas fa-times' /></span>}
                </button>
              </div>
              : ''}
            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbar-collapse' aria-controls='navbar-collapse' aria-expanded='false' aria-label='Toggle navigation'>
              <span className='navbar-toggler-icon' />
            </button>
            <div className='navbar-collapse navbar-custom-collapse collapse ml-auto mr-0' id='navbar-collapse'>
              <div className='navbar-collapse-header'>
                <div className='row'>
                  <div className='col-9 collapse-brand'>
                    <div className='logo-text'>
                      <img src={require('../../../../assets/logo-white.png')} className='logo-image' />
                      {/* <h1 style={{ color: '#333' }}>AM to PM</h1> */}
                    </div>
                  </div>
                  <div className='col-3 pt-2 collapse-close'>
                    <button type='button' className='navbar-toggler' data-toggle='collapse' data-target='#navbar-collapse' aria-controls='navbar-collapse' aria-expanded='false' aria-label='Toggle navigation'>
                      <span />
                      <span />
                    </button>
                  </div>
                </div>
              </div>
              {!this.state.isUserLogedin
              ? <ul className='navbar-nav mr-auto'>
                <li className='nav-item dropdown'>
                  <div className='dropdown'>
                    <a className='nav-link' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' id='navbarDropdownMenuLink2'>
                      <img src={require('../../serviceproviders/images/US.png')} />
                    </a>
                    <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink2'>
                      <li>
                        <a className='dropdown-item' onClick={setLocale('te')}>
                          <img src={require('../../serviceproviders/images/DE.png')} /> Telugu
                        </a>
                      </li>
                      <li>
                        <a className='dropdown-item' onClick={setLocale('en')}>
                          <img src={require('../../serviceproviders/images/GB.png')} /> English(UK)
                        </a>
                      </li>
                      <li>
                        <a className='dropdown-item' onClick={setLocale('hn')}>
                          <img src={require('../../serviceproviders/images/FR.png')} /> Hindi
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleHostLogin} className='nav-link' >
                    <span className='nav-link-inner--text'>{ t`lanEUButtonHostLogin` }</span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleBecomeHost} className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonBecomeHost` } </span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonSupport` }</span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleEnduserSignup} className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonSignup` }</span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleEndUserLogin} className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonLogin` }</span>
                  </a>
                </li>
              </ul>
              : <ul className='navbar-nav align-items-center ml-md-0 mr-auto'>
                <li className='nav-item dropdown'>
                  <div className='dropdown'>
                    <a className='nav-link' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' id='navbarDropdownMenuLink2'>
                      <img src={require('../../serviceproviders/images/US.png')} />
                      <span className='text-white'>EN</span>
                    </a>
                    <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink2'>
                      <li>
                        <a className='dropdown-item' onClick={setLocale('te')}>
                          <img src={require('../../serviceproviders/images/DE.png')} /> Telugu
                        </a>
                      </li>
                      <li>
                        <a className='dropdown-item' onClick={setLocale('en')}>
                          <img src={require('../../serviceproviders/images/GB.png')} /> English(UK)
                        </a>
                      </li>
                      <li>
                        <a className='dropdown-item' onClick={setLocale('hn')}>
                          <img src={require('../../serviceproviders/images/FR.png')} /> Hindi
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleBecomeHost} className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonBecomeHost` }</span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonSupport` }</span>
                  </a>
                </li>
                <li className='nav-item'>
                  {/* <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Notifications' })} onClick={this.handleNotifications} >
                    <i className='far fa-bell text-green' />
                    <span className='badge badge-md notify badge-circle badge-floating badge-danger border-white'>{this.state.notificationsUnReadCount}</span>
                  </a> */}
                  <a className='nav-link' role='button' onClick={this.handleNotifications}>
                    <span> <i className='fas fa-bell' /></span>
                    <span className='badge badge-md notify badge-circle badge-floating badge-danger border-white'>{this.state.notificationsUnReadCount}</span>
                  </a>
                </li>
                <li className='nav-item dropdown'>
                  <a className='nav-link pr-3' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    <div className='media align-items-center'>
                      <span className='avatar avatar-sm rounded-circle'>
                        <img src={(this.state.authObj && this.state.authObj.userIconPath) ? config.baseUrl + this.state.authObj.userIconPath
                        : require('../../../../assets/profile-icon.png')} />
                      </span>
                      <div className='media-body ml-2 d-none d-lg-block'>
                        <span className='mb-0 text-sm font-weight-bold'>{this.state.authObj.name ? this.state.authObj.name : this.state.authObj.displayName}</span>
                      </div>
                    </div>
                  </a>
                  <div className='dropdown-menu dropdown-menu-right'>
                    <div className='dropdown-header noti-title'>
                      <h6 className='text-overflow m-0'>{ t`lanEUTitleWelcome` }!</h6>
                    </div>
                    <a onClick={this.handleEUProfile} className='dropdown-item'>
                      <i className='fas fa-user' />
                      <span>{ t`lanEUButtonMyprofile` }</span>
                    </a>
                    <a onClick={this.handleSupport} className='dropdown-item'>
                      <i className='far fa-life-ring' />
                      <span>{ t`lanEUButtonSupport` }</span>
                    </a>
                    <div className='dropdown-divider' />
                    <a onClick={this.handleLogout} className='dropdown-item'>
                      <i className='fas fa-power-off' />
                      <span>{ t`lanEUButtonLogOut` }</span>
                    </a>
                  </div>
                </li>
              </ul>
              }
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

MainHeader.propTypes = {
  navRoute:PropTypes.any,
  location: PropTypes.any,
  getAddressComponents: PropTypes.any,
  drawerValue: PropTypes.any
}

export default MainHeader
