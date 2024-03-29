import React from "react";
import "./css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import "./css/reset.css";
import Announcement from "./Announcement";
import { Typography } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import { fire } from "../../../Fire";

class Stream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upcoming_works: [],
      announcements: [],
      addQuizFeedback: false,
      addAnnouncement: false,
      announcement: {},
      quizzes: [],
      feedbacks: [],
      title: null,
      link: null,
      res_link: null,
      quiz_type: "quiz",
      course_id: null,
      course_title: null,
      course_teacher: null,
      fetchDone: false,
      ans_link: null,
      sub_Quest: null,
      sub_QMrks: null,
    };
  }

  fetchAnnouncements = async () => {
    const ref = fire.database().ref();
    await ref.once("value", (userSnapshot) => {
      userSnapshot
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .forEach((snap) => {
          const temp = {
            title: snap.child("Title").val(),
            link: snap.child("Link").val(),
            isGrade: snap.child("isGrade").val(),
            isFeedback: snap.child("isFeedback").val(),
            date: snap.child("Date").val(),
          };
          this.setState({ announcements: [...this.state.announcements, temp] });
        });
    });

    await this.sortAnnouncements();
    this.setState({ fetchDone: true });
  };

  sortAnnouncements = () => {
    this.state.announcements.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    console.log("Announcements:", this.state.announcements);
  };
  reloadPage = () => {
    window.location.reload();
  };
  componentDidMount = async () => {
    this.setState({ course_id: this.props.id.slice(0, -4) });
    const ref = fire.database().ref();
    ref.once("value", (userSnapshot) => {
      this.setState({
        course_title: userSnapshot
          .child("Courses")
          .child(this.state.course_id)
          .child("name")
          .val(),
      });
    });
    ref.once("value", (userSnapshot) => {
      this.setState({
        course_teacher: userSnapshot
          .child("Courses")
          .child(this.state.course_id)
          .child("TeacherName")
          .val(),
      });
    });
    await this.fetchAnnouncements();
  };

  addAnnouncementToggle = () => {
    this.setState((prevState) => {
      return {
        addAnnouncement: !prevState.addAnnouncement,
      };
    });
  };
  addQuizFeedbackToggle = () => {
    this.setState((prevState) => {
      return {
        addQuizFeedback: !prevState.addQuizFeedback,
      };
    });
  };

  handleAnnouncementChange = (event) => {
    this.setState({
      announcement: {
        title: event.target.value,
        link: "",
        isGrade: false,
        date: new Date(),
      },
    });
  };
  handleAnnouncementSubmit = (event) => {
    fire
      .database()
      .ref()
      .child("Courses")
      .child(this.state.course_id)
      .child("announcements")

      .child(this.state.announcement.title)
      .child("Title")
      .set(this.state.announcement.title);

    fire
      .database()
      .ref()
      .child("Courses")
      .child(this.state.course_id)
      .child("announcements")
      .child(this.state.announcement.title)
      .child("Link")
      .set("");
    fire
      .database()
      .ref()
      .child("Courses")
      .child(this.state.course_id)
      .child("announcements")
      .child(this.state.announcement.title)
      .child("Date")
      .set(this.state.announcement.date.toString());

    console.log(this.state.announcements);
    this.addAnnouncementToggle();
    this.reloadPage();
    event.preventDefault();
  };

  handleQuizSubmit = (event) => {
    event.preventDefault();
    const obj = {
      title: this.state.title,
      link: this.state.link,
      res_link: this.state.res_link,
    };
    const announcement = {
      title: this.state.title,
      link: this.state.link,
      isGrade: false,
      isFeedback: true,
      date: new Date(),
    };
    console.log(this.state.quiz_type);
    console.log(obj);
    if (this.state.quiz_type == "quiz") {
      this.setState(
        {
          quizzes: [...this.state.quizzes, obj],
        },
        () => console.log("Quiz array", this.state.quizzes)
      );
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("quizzes")
        .child(obj.title)
        .child("Link")
        .set(obj.link);
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("quizzes")
        .child(obj.title)
        .child("ResultLink")
        .set(obj.res_link);

      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("quizzes")
        .child(obj.title)
        .child("AnswerLink")
        .set(this.state.ans_link);

      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("quizzes")
        .child(obj.title)
        .child("NoOfQuest")
        .set(this.state.sub_Quest);

      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("quizzes")
        .child(obj.title)
        .child("SubjMrks")
        .set(this.state.sub_QMrks);

      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("Title")
        .set(announcement.title);

      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("Link")
        .set(announcement.link);
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("isGrade")
        .set(true);
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("isFeedback")
        .set(false);

      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("Date")
        .set(announcement.date.toString());
    } else if (this.state.quiz_type == "feedback") {
      this.setState(
        {
          feedbacks: [...this.state.feedbacks, obj],
        },
        () => console.log("Feedback array", this.state.feedbacks)
      );
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("feedbacks")
        .child(obj.title)
        .child("Link")
        .set(obj.link);
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("feedbacks")
        .child(obj.title)
        .child("ResultLink")
        .set(obj.res_link);

      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("Title")
        .set(announcement.title);

      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("Link")
        .set(announcement.link);
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("isGrade")
        .set(false);
      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("isFeedback")
        .set(true);

      fire
        .database()
        .ref()
        .child("Courses")
        .child(this.state.course_id)
        .child("announcements")
        .child(announcement.title)
        .child("Date")
        .set(announcement.date.toString());
    }
    this.reloadPage();
    this.addQuizFeedbackToggle();
  };

  render() {
    return (
      <main className="container">
        <section
          className="
            d-flex
            flex-column
            gap-2
            space-header
            banner
            text-white
            bg-secondary
            px-3
            py-4
            rounded
          "
        >
          <h1 className="banner__class">{this.state.course_title}</h1>
          <div className="fs-4">
            <span>Teacher: </span>
            <span className="banner__teacher">{this.state.course_teacher}</span>
          </div>
        </section>
        <section className="container mt-5">
          <div className="row">
            <div className="col col-lg-3 d-none d-lg-block">
              <button
                className="
                d-flex
                align-items-center
                shadow
                rounded
                px-3
                py-4
                bg-success
                text-primary
                cursor-pointer
                w-100
                mb-4
              "
                onClick={this.addQuizFeedbackToggle}
              >
                <span className="text-white">Add Quiz</span>
              </button>
              <Modal
                show={this.state.addQuizFeedback}
                onHide={this.addQuizFeedbackToggle}
                animation={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>New Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={this.handleQuizSubmit}>
                    <label>Select Type:</label>
                    <br></br>
                    <select
                      id="dropdown"
                      value={this.state.quiz_type}
                      onChange={(event) => {
                        this.setState({ quiz_type: event.target.value }, () =>
                          console.log(event.target.value)
                        );
                      }}
                    >
                      <option value="quiz">Quiz</option>
                      <option value="feedback">Feedback</option>
                    </select>
                    <div>
                      <Typography
                        align="center"
                        style={{ fontSize: 15, marginBottom: 10 }}
                      >
                        Enter Title
                      </Typography>
                      <TextField
                        id="standard-basic"
                        label="Enter Title"
                        variant="standard"
                        value={this.state.title}
                        onChange={(event) =>
                          this.setState({ title: event.target.value })
                        }
                        fullWidth
                      />
                    </div>

                    <div>
                      <Typography
                        align="center"
                        style={{ fontSize: 15, marginBottom: 10 }}
                      >
                        Enter No.of Subjective Questions
                      </Typography>
                      <TextField
                        id="standard-basic"
                        label="Enter Number of Questions"
                        variant="standard"
                        value={this.state.sub_Quest}
                        onChange={(event) =>
                          this.setState({ sub_Quest: event.target.value })
                        }
                        fullWidth
                      />
                    </div>

                    <div>
                      <Typography
                        align="center"
                        style={{ fontSize: 15, marginBottom: 10 }}
                      >
                        Enter marks of subjective question
                      </Typography>
                      <TextField
                        id="standard-basic"
                        label="Enter marks"
                        variant="standard"
                        value={this.state.sub_QMrks}
                        onChange={(event) =>
                          this.setState({ sub_QMrks: event.target.value })
                        }
                        fullWidth
                      />
                    </div>

                    <div>
                      <Typography
                        align="center"
                        style={{ fontSize: 15, marginBottom: 10 }}
                      >
                        Enter Form Link
                      </Typography>
                      <TextField
                        id="standard-basic"
                        label="Enter Link"
                        variant="standard"
                        value={this.state.link}
                        onChange={(event) => {
                          this.setState({ link: event.target.value });
                        }}
                        fullWidth
                      />
                    </div>
                    <div>
                      <Typography
                        align="center"
                        style={{ fontSize: 15, marginBottom: 10 }}
                      >
                        Enter Response Sheet Link
                      </Typography>
                      <TextField
                        id="standard-basic"
                        label="Enter Link"
                        variant="standard"
                        value={this.state.res_link}
                        onChange={(event) => {
                          this.setState({ res_link: event.target.value });
                        }}
                        fullWidth
                      />
                    </div>

                    <div>
                      <Typography
                        align="center"
                        style={{ fontSize: 15, marginBottom: 10 }}
                      >
                        Enter Modal Answer Link
                      </Typography>
                      <TextField
                        id="standard-basic"
                        label="Enter Link"
                        variant="standard"
                        value={this.state.ans_link}
                        onChange={(event) => {
                          this.setState({ ans_link: event.target.value });
                        }}
                        fullWidth
                      />
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <Button variant="secondary" type="submit">
                        Post
                      </Button>
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={this.addAnnouncementToggle}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div className="col col-lg-9">
              <button
                className="
                d-flex
                align-items-center
                shadow
                rounded
                px-3
                py-4
                bg-success
                text-primary
                cursor-pointer
                w-100
                mb-4
              "
                onClick={this.addAnnouncementToggle}
              >
                <span className="text-white">
                  Announce something to your class
                </span>
              </button>
              <Modal
                show={this.state.addAnnouncement}
                onHide={this.addAnnouncementToggle}
                animation={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>New Announcement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={this.handleAnnouncementSubmit}>
                    <label>
                      Enter Announcement:
                      <input
                        type="text"
                        value={this.state.announcement.title}
                        onChange={this.handleAnnouncementChange}
                      />
                    </label>
                    <br></br>

                    <br></br>
                    <input type="submit" value="Submit" />
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={this.addAnnouncementToggle}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              {this.state.fetchDone
                ? this.state.announcements.map((announcement) => (
                    <Announcement
                      title={announcement.title}
                      link={announcement.link}
                      grade={announcement.isGrade}
                      feedback={announcement.isFeedback}
                      id={this.state.course_id}
                      contract={this.props.contract}
                      accounts={this.props.accounts}
                      contractToken={this.props.contractToken}
                      gasPrice={this.props.gasPrice}
                    />
                  ))
                : null}
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Stream;
