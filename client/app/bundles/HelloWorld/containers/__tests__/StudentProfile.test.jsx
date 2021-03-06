import React from 'react';
import { shallow } from 'enzyme';

import StudentProfile from '../StudentProfile.jsx';

import $ from 'jquery'
import StudentClassroomNavbar from '../../components/student_profile/student_classroom_navbar.jsx'
import NextActivity from '../../components/student_profile/next_activity.jsx'
import StudentProfileUnits from '../../components/student_profile/student_profile_units.jsx'

jest.mock('jquery', () => {
  return {
    ajax: jest.fn()
  }
});

const student = {
  name: 'student',
  classroom: {name: 'classroom', teacher: {name: 'teacher'}}
}

describe('StudentProfile container', () => {

  it('should render empty spans if first batch is not loaded', () => {
    expect(shallow(<StudentProfile />).html()).toBe('<span></span>');
  });

  describe('with first batch loaded', () => {
    const wrapper = shallow(<StudentProfile />);
    wrapper.setState({
      firstBatchLoaded: true,
      student,
      next_activity_session: {
        foo: 'baz'
      },
      grouped_scores: {
        food: 'bars'
      }
    });
    describe('StudentClassroomNavbar component', () => {
      it('should render', () => {
        expect(wrapper.find(StudentClassroomNavbar).exists()).toBe(true);
      });

      it('should have student data in data prop', () => {
        expect(wrapper.find(StudentClassroomNavbar).props().data.name).toBe('student');
      });

      it('should have fetchData prop that fetches data', () => {
        wrapper.find(StudentClassroomNavbar).props().fetchData(3);
        expect(wrapper.state().currentClassroom).toBe(3);
        expect(wrapper.state().loading).toBe(true);
        expect($.ajax).toHaveBeenCalled();
        expect($.ajax.mock.calls[0][0].url).toBe('/student_profile_data');
        expect($.ajax.mock.calls[0][0].data.current_classroom_id).toBe(3);
        expect($.ajax.mock.calls[0][0].format).toBe('json');
        expect($.ajax.mock.calls[0][0].success).toBe(wrapper.instance().loadProfile);
      });
    });

    describe('NextActivity component', () => {
      it('should render', () => {
        expect(wrapper.find(NextActivity).exists()).toBe(true);
      });

      it('should have next activity session data in data prop', () => {
        expect(wrapper.find(NextActivity).props().data.foo).toBe('baz');
      });

      it('should have loading prop based on state', () => {
        wrapper.setState({loading: true});
        expect(wrapper.find(NextActivity).props().loading).toBe(true);
        wrapper.setState({loading: false});
        expect(wrapper.find(NextActivity).props().loading).toBe(false);
      });

      it('should have hasActivities prop based on grouped scores', () => {
        wrapper.setState({grouped_scores: {}});
        expect(wrapper.find(NextActivity).props().hasActivities).toBe(false)
        wrapper.setState({grouped_scores: {food: 'bars'}});
        expect(wrapper.find(NextActivity).props().hasActivities).toBe(true)
      });
    });

    describe('StudentProfileUnits component', () => {
      it('should render', () => {
        expect(wrapper.find(StudentProfileUnits).exists()).toBe(true);
      });

      it('should have grouped scores in data prop', () => {
        expect(wrapper.find(StudentProfileUnits).props().data.food).toBe('bars');
      });

      it('should have loading prop based on state', () => {
        wrapper.setState({loading: true});
        expect(wrapper.find(StudentProfileUnits).props().loading).toBe(true);
        wrapper.setState({loading: false});
        expect(wrapper.find(StudentProfileUnits).props().loading).toBe(false);
      });
    });
  });

  it('loadProfile function should update state', () => {
    const wrapper = shallow(<StudentProfile />);
    wrapper.instance().loadProfile({fudge: 'bags'});
    expect(wrapper.state().fudge).toBe('bags');
    expect(wrapper.state().ajaxReturned).toBe(true);
    expect(wrapper.state().loading).toBe(false);
    expect(wrapper.state().firstBatchLoaded).toBe(true);
  });

});
