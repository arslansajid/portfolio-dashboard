import React from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class ExerciseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      project: {
        domain: '',
        name: '',
        client: '',
        completed_At: '',
        description: '',
        gallery: [],
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postProject = this.postProject.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.projectId)
      axios.get(`${API_END_POINT}/api/v1/project/${match.params.projectId}`)
        .then((response) => {
          this.setState({
            project: response.data.project,
          }, () => {
            const {project} = this.state;
            if(project.videos_url === null) {
              project.video_files = [];
              this.setState({ project })
            } else {
              this.setState({videoInputCount: project.videos_url.length })
            }
          });
        });
  }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      project: {
        ...prevState.project,
        city_id: selectedCity.ID,
      },
    }));
  }

  setDescription(description) {
    const { project } = this.state;
    project.description = description.toString('html');
    this.setState({
      project,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { project } = this.state;
    project[name] = value;
    this.setState({ project });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { project } = this.state;
    project[name][index] = event.target.files[0];
    this.setState({ project });
  }

  postProject(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, project } = this.state;
    if (!loading) {
      const fd = new FormData();

      // let videosArray = [];
      // for (let index = 0; index < project.video_files.length; index += 1) {
      //   videosArray.push(project.video_files[index]);
      // }

      // project.video_files.forEach((video, index) => {
      //   fd.append(`video_files[${index}]`, video);
      // });

      Object.keys(project).forEach((eachState) => {
        fd.append(`${eachState}`, project[eachState]);
      })
      
      this.setState({ loading: true });
      if (match.params.projectId) {
        axios.put(`${API_END_POINT}/api/save/project-save/${match.params.projectId}`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data.message);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR UPDATING !')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR UPDATING !')
            this.setState({ loading: false });
          })
      }
      else {
        axios.post(`${API_END_POINT}/api/save/project-save`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data.message);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR SAVING !')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR SAVING !')
            this.setState({ loading: false });
          })
      }
    }
  }

  handleFile = (event) => {
    this.setState({
      profile_picture: event.target.files.length ? event.target.files[0] : '',
    });
  }

  render() {
    console.log(this.state);
    const {
      loading,
      project,
      description,
      city,
      cities,
      videoInputCount
    } = this.state;

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Project Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postProject}
                  >

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={project.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Client
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="client"
                          className="form-control"
                          value={project.client}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Domain
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="domain"
                          className="form-control"
                          value={project.domain}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Description
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="description"
                          className="form-control"
                          value={project.description}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Timer Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="timer_type"
                          value={project.timer_type}
                          className="form-control"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="project">Project</option>
                          <option value="rest">Rest</option>
                        </select>
                      </div>
                    </div> */}

                  {/* {[...Array(videoInputCount)].map((count, index) => {
                    return (
                      <div className="form-group row" key={index}>
                      <label className="control-label col-md-3 col-sm-3">Video</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="video/*"
                          name="video_files"
                          className="form-control"
                          onChange={(event) => this.handleVideoURLChange(event, index)}
                        />
                      </div>
                    </div>
                    )
                  })} */}
                    
                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`} /> Submit
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

