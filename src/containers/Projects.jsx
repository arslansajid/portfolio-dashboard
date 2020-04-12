import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('panzer_access_token');

export default class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Projects...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }

  componentWillMount() {
    this.fetchProjects();
  }

  fetchProjects = () => {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/fetch/project-fetch`)
    .then(response => {
      this.setState({
        projects: response.data.projects,
        loading: false,
        responseMessage: 'No Projects Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No Projects Found...'
      })
    })
  }
  
  deleteProjects(exerciseId, index) {
    if(confirm("Are you sure you want to delete this project?")) {
      axios.delete(`${API_END_POINT}/api/v1/project/${exerciseId}`)
        .then(response => {
          const projects = this.state.projects.slice();
          projects.splice(index, 1);
          this.setState({ projects });
          window.alert(response.data.message);
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }

  handleSearch() {
    const { q } = this.state;
    if(q.length) {
    this.setState({loading: true, projects: [], responseMessage: 'Loading Projects...'})
    // if(q === "") {
    //   this.fetchProjects();
    // } else {
      axios.get(`${API_END_POINT}/api/items/project/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          projects: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Projects Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Projects Found...'
        })
      })
    }
  }

  render() {
    // console.log(this.state);
    const {loading, projects, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Projectss</h3>
            </div>
            <div  className="col-sm-4">
              <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchProjects();
                    }
                  })}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div>

          <div className="col-sm-4 pull-right mobile-space">
              <Link to="/projects/projects-form">
                <button type="button" className="btn btn-success">Add New Projects</button>
              </Link>
          </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  {/* <th>Picture</th> */}
                  <th>Name</th>
                  <th>Total Days</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Intensity</th>
                  <th>Timer_type</th>
                  <th>Duration</th>
                  <th>Rest Duration</th>
                  <th>Total Days</th>
                  <th>Video Urls</th>
                </tr>
              </thead>
              <tbody>
                {this.state.projects && this.state.projects.length >= 1 ?
                this.state.projects.map((project, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{textTransform: "capitalize"}}>{project.name}</td>
                  {/* <td>{<img style={{height: '50px', width: '50px'}} src={project.image && project.image}/>}</td> */}
                  <td>{project.total_days}</td>
                  <td>{project.sets}</td>
                  <td>{project.reps}</td>
                  <td>{project.intensity}</td>
                  <td>{project.timer_type ? project.timer_type : "-"}</td>
                  <td>{project.duration ? project.duration : "-"}</td>
                  <td>{project.timer_type ? project.timer_type : "-"}</td>
                  <td>{project.rest_duration ? project.rest_duration : "-"}</td>
                  <td>{project.video_urls ? project.video_urls.length : "-"}</td>
                  <td>
                    <Link to={`/projects/edit-projects/${project.id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteProjects(project.id, index)}></span>
                  </td>
                </tr>
                )) :
                (
                  <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
          {/* <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      </div>
    );
  }
}
