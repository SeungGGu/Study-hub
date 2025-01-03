import React, {useState, useEffect} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import Modal from 'react-modal';
import '../../styles/Calendar.css';

Modal.setAppElement('#root');

const Calendar = () => {
    const studyId = sessionStorage.getItem('studyId');
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        studyId: studyId,
        title: '',
        allDay: false,
        startTime: '',
        endTime: '',
        isPublic: false,
        location: '',
        description: '',
        recurrence: {
            frequency: 'none',
            endDate: ''
        }
    });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const response = await fetch(`/api/calendar/events?studyId=${studyId}`);
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
            const mappedEvents = data.map(event => ({
                title: event.title,
                start: event.startTime,
                end: event.endTime,
                startTime: event.startTime,
                endTime: event.endTime,
                description: event.description
            }));
            setEvents(mappedEvents);
        } else {
            console.error('Fetched data is not an array:', data);
        }
    };

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const renderEventContent = (events) => {
        return (
            <div className="custom-event-content">
                <i>{events.event.title}</i>
                <b>{events.timeText}</b>
            </div>
        );
    };

    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
        const selectedDateTime = new Date(arg.dateStr);
        const endDateTime = new Date(selectedDateTime);
        endDateTime.setHours(selectedDateTime.getHours() + 1);

        setNewEvent(prev => ({
            ...prev,
            startTime: selectedDateTime.toISOString().slice(0, 16),
            endTime: endDateTime.toISOString().slice(0, 16)
        }));
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setNewEvent((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleRecurrenceChange = (e) => {
        const {name, value} = e.target;
        setNewEvent((prevState) => ({
            ...prevState,
            recurrence: {
                ...prevState.recurrence,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/calendar/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent)
            });

            if (!response.ok) {
                throw new Error('일정 추가 실패');
            }

            const savedEvent = await response.json();

            // 새 이벤트를 캘린더에 추가
            setEvents([...events, {
                title: savedEvent.title,
                start: savedEvent.startTime,
                end: savedEvent.endTime,
                startTime: savedEvent.startTime,
                endTime: savedEvent.endTime,
                description: savedEvent.description
            }]);

            // 모달 닫기 및 폼 초기화
            setIsModalOpen(false);
            setNewEvent({
                studyId: studyId,
                title: '',
                allDay: false,
                startTime: '',
                endTime: '',
                isPublic: false,
                location: '',
                description: '',
                recurrence: {
                    frequency: 'none',
                    endDate: ''
                }
            });
        } catch (error) {
            console.error('일정 추가 중 오류 발생:', error);
            alert('일정 추가에 실패했습니다.');
        }
    };

    const filteredEvents = events.filter(event => {
        const eventStartTime = new Date(event.start);
        const eventEndTime = new Date(event.end);

        // Convert start and end dates to ISO date strings (YYYY-MM-DD)
        const startDate = eventStartTime.toISOString().slice(0, 10);
        const endDate = eventEndTime.toISOString().slice(0, 10);

        // Check if selectedDate is between start and end dates inclusively
        return selectedDate >= startDate && selectedDate <= endDate;
    });

    const handleEventClick = (info) => {
        const clickedEvent = events.find(event =>
            event.start === info.event.startStr &&
            event.end === info.event.endStr &&
            event.title === info.event.title
        );
        setSelectedEvent(clickedEvent);
        setIsModalOpen(true);
    };

    const handleEditClick = () => {
        setIsEditMode(true);
        setNewEvent({
            ...selectedEvent,
            studyId: studyId,
            startTime: selectedEvent.start,
            endTime: selectedEvent.end
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = async () => {
        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
            try {
                await fetch(`/api/calendar/events/${selectedEvent.id}`, {
                    method: 'DELETE'
                });
                setEvents(events.filter(event => event.id !== selectedEvent.id));
                setSelectedEvent(null);
                setIsModalOpen(false);
            } catch (error) {
                console.error('일정 삭제 중 오류 발생:', error);
                alert('일정 삭제에 실패했습니다.');
            }
        }
    };

    return (
        <div className="calendar-container">
            <div className="content">
                <div className="calendar-section">

                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        dayMaxEvents={true}
                        handleWindowResize={true}
                        windowResizeDelay={100}
                        stickyHeaderDates={true}
                        events={events}
                        height={'1080px'}
                        editable={true}
                        dateClick={handleDateClick}
                        nowIndicator={true}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek'
                        }}
                        locale={koLocale}
                        eventContent={renderEventContent}
                        navLinks={true}
                        slotEventOverlap={false}
                        slotLabelFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }}
                        eventOverlap={true}
                        eventClick={handleEventClick}
                    />
                </div>
                <div className="schedule-section">
                    <div className="schedule-header">
                        <h3>{selectedDate}</h3>
                        <button className="add-event-button" onClick={() => setIsModalOpen(true)}>
                            일정 추가
                        </button>
                    </div>
                    {filteredEvents.length > 0 ? (
                        <ul className="event-list">
                            {filteredEvents.map((event, index) => (
                                <li key={index} className="event-item">
                                    <div className="event-content">
                                        <div className="event-time">
                                            <strong>시작 시간: </strong>{formatTime(event.startTime)}
                                        </div>
                                        <div className="event-time">
                                            <strong>종료 시간: </strong>{formatTime(event.endTime)}
                                        </div>
                                        <div className="event-title">
                                            <strong>제목: </strong>{event.title}
                                        </div>
                                        <div className="event-description">
                                            <strong>설명: </strong>{event.description}
                                        </div>
                                    </div>
                                    <div className="event-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                setIsEditMode(true);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            수정
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteClick(event.id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>일정이 없습니다</p>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                    setIsEditMode(false);
                }}
                contentLabel={isEditMode ? "일정 수정" : selectedEvent ? "일정 상세" : "새 일정"}
                className="event-modal"
                overlayClassName="event-modal-overlay"
            >
                <button
                    className="modal-close-btn"
                    onClick={() => {
                        setIsModalOpen(false);
                        setSelectedEvent(null);
                        setIsEditMode(false);
                    }}
                >
                    ×
                </button>
                {selectedEvent && !isEditMode ? (
                    <div className="event-detail">
                        <h2>{selectedEvent.title}</h2>
                        <div className="event-info">
                            <p><strong>시작:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
                            <p><strong>종료:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                            {selectedEvent.description && (
                                <p><strong>설명:</strong> {selectedEvent.description}</p>
                            )}
                            {selectedEvent.location && (
                                <p><strong>장소:</strong> {selectedEvent.location}</p>
                            )}
                        </div>
                        <div className="event-actions">
                            <button onClick={handleEditClick} className="edit-btn">수정</button>
                            <button onClick={handleDeleteClick} className="delete-btn">삭제</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2>{isEditMode ? "일정 수정" : "새 일정 추가"}</h2>
                        <form onSubmit={handleSubmit} className="event-form">
                            <label>
                                일정 제목:
                                <input
                                    type="text"
                                    name="title"
                                    value={newEvent.title}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <div className="checkbox-container">
                                <div className="checkbox-all-day">
                                    <label className="checkbox-label">
                                        종일 :
                                        <input type="checkbox" name="allDay" checked={newEvent.allDay}
                                               onChange={handleInputChange}/>
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </div>
                                <div className="checkbox-public">
                                    <label className="checkbox-label">
                                        공개 :
                                        <input type="checkbox" name="isPublic" checked={newEvent.isPublic}
                                               onChange={handleInputChange}/>
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="horizontal-group">
                                <label>
                                    시작 시간:
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        value={newEvent.startTime}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    종료 시간:
                                    <input
                                        type="datetime-local"
                                        name="endTime"
                                        value={newEvent.endTime}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                            <label className="location-label">
                                장소:
                                <input
                                    type="text"
                                    name="location"
                                    value={newEvent.location}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                설명:
                                <textarea
                                    name="description"
                                    value={newEvent.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </label>
                            <label>
                                반복:
                                <select
                                    name="frequency"
                                    value={newEvent.recurrence.frequency}
                                    onChange={handleRecurrenceChange}
                                >
                                    <option value="none">반복 안 함</option>
                                    <option value="DAILY">매일</option>
                                    <option value="WEEKLY">매주</option>
                                    <option value="MONTHLY">매월</option>
                                    <option value="YEARLY">매년</option>
                                </select>
                            </label>
                            <label>
                                반복 종료 날짜:
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={newEvent.recurrence.endDate}
                                    onChange={handleRecurrenceChange}
                                />
                            </label>
                            <button type="submit">저장</button>
                        </form>
                    </>
                )}
            </Modal>
        </div>
    )
        ;
};

export default Calendar;
