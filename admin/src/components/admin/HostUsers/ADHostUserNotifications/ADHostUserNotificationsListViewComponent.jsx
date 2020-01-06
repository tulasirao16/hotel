/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import PropTypes from 'prop-types'

class ADHostsNotificationsListViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      notificationObj: this.props.notificationData,
      notificationData: [],
      notificationMessage: '',
      notificationTitle: '',
      notificationStatus: '',
      notification: '',
      notificationList: []
    }
    // this.handleHome = this.handleHome.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  componentWillMount () {
    let notificationObj = this.state.notificationObj
    this.setState({
      notificationMessage: notificationObj.notificationMessage,
      notificationTitle: notificationObj.notificationTitle
    })
  }
  handleBack () {
    this.props.handleViewUser()
    event.preventDefault()
  }
//   handleHome (event) {
//     hashHistory.push('/admin/home')
//     event.preventDefault()
//   }
  render () {
    return (
      <div className='main-content view-rating-page enduser' id='panel'>
        {/* ------- Navbar --------- */}
        {/* <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-7 pb-5'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active eu-font'><a onClick={this.handleHosts}>Hosts Notifications List</a></li>
                      <li className='breadcrumb-item'><a onClick={() => this.props.handleViewUser()}>Notifications List</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Notification Details</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className='container mt--6 pb-4'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-10 card-wrapper'>
              <div className='card mb-2'>
                {/* <div className='card-header bg-transparent px-5 pb-3 row'>
                  <h5 className='card-title col-sm-10'>Notification Details</h5>
                </div> */}
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {/* List group */}
                        <div className='card-body'>
                          <ul className='list-group list-group-flush list my--3'>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanSPLabelNotificationTitle`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <p className='mb-0 card-text'>
                                    {this.state.notificationTitle}
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanSPLabelNotificationMessage`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <p className='mb-0 card-text'>{this.state.notificationMessage}</p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div style={{ color: 'red' }}>
                          {this.state.errMessage}
                        </div>
                        <div style={{ color: 'green' }}>
                          {this.state.successMessage}
                        </div>
                      </div>
                    </div>
                    <div className='text-center'>
                      <button className='btn btn-primary btn-one' onClick={() => this.handleBack()}>{t`lanCommonButtonBack`}</button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ADHostsNotificationsListViewComponent.propTypes = {
  notificationData: PropTypes.any,
  handleViewUser: PropTypes.any
}

export default ADHostsNotificationsListViewComponent
