import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Typography, Grid, IconButton, Box, Menu, MenuItem } from "@mui/material";
import { Event as CalendarIcon, Place as LocationIcon, Link as LinkIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import EventModal from "../components/EventModal";
import EditEventModal from "../components/EditEventModal";
import DeleteModal from "../components/DeleteModal";
import "../styles/EventPage.css"

const EventPage = () => {
    const [userName, setUserName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const fetchRole = () => {
            const storedRole = localStorage.getItem("role");
            setUserRole(storedRole);
        };

        fetchRole();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/events");
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

    const handleEventAdded = (newEvent) => {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    const handleEventUpdated = (updatedEvent) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
        );
    };

    const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleMenuOpen = (event, eventId) => {
        setMenuAnchor(event.currentTarget);
        setSelectedEvent(eventId);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedEvent(null);
    };

    const handleEdit = (eventId) => {
        const eventToModify = events.find((event) => event._id === eventId);
        setEventToEdit(eventToModify);
        setIsEditModalOpen(true);
        handleMenuClose();
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/events/${eventToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Event deleted successfully!");
            setEvents((prevEvents) => prevEvents.filter(event => event._id !== eventToDelete._id));

        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event.");
        }

        setIsDeleteModalOpen(false);
        setEventToDelete(null);
    };

    const handleDelete = (eventId) => {
        const eventToRemove = events.find((event) => event._id === eventId);
        setEventToDelete(eventToRemove);
        setIsDeleteModalOpen(true);
        handleMenuClose();
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const closeEditModal = () => setIsEditModalOpen(false);

    return (
        <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div className="dashboard-content" style={{ flexGrow: 1, padding: '20px' }}>
            <DashboardHeader userName={userName} onSearch={setSearchQuery} searchType="events" />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">All Events</Typography>
                    {userRole === "admin" && (
                        <Button className="create-event-button" onClick={openModal}>Create Event</Button>
                    )}
                </Box>
                <Grid container spacing={3} rowSpacing={7}>
                    {filteredEvents.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Box sx={{
                                borderRadius: 2,
                                p: 2,
                                boxShadow: 3,
                                background: '#fff',
                                transition: '0.3s',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative'
                            }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography 
                                        fontWeight="bold" 
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '80%'
                                        }}
                                    >
                                        {event.name}
                                    </Typography>
                                    {userRole === "admin" && (
                                        <IconButton onClick={(e) => handleMenuOpen(e, event._id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    )}
                                </Box>

                                <Menu
                                    anchorEl={menuAnchor}
                                    open={Boolean(menuAnchor) && selectedEvent === event._id}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={() => handleEdit(event._id)}>Edit</MenuItem>
                                    <MenuItem onClick={() => handleDelete(event._id)}>Delete</MenuItem>
                                </Menu>

                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    {event.description}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2" display="flex" alignItems="center">
                                        <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                        {new Date(event.dateTime).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" display="flex" alignItems="center">
                                        <LocationIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
                                        {event.location}
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <IconButton
                                            component={event.meetLink ? "a" : "div"}
                                            href={event.meetLink || "#"}
                                            target="_blank"
                                            color="primary"
                                            disabled={!event.meetLink}
                                        >
                                            <LinkIcon />
                                        </IconButton>
                                        {!event.meetLink && <Typography variant="caption" color="textSecondary">No Link</Typography>}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </div>
            {isModalOpen && <EventModal onClose={closeModal} onEventAdded={handleEventAdded} />}
            {isEditModalOpen && eventToEdit && (
                <EditEventModal 
                    eventData={eventToEdit} 
                    onClose={closeEditModal} 
                    onEventUpdated={handleEventUpdated} 
                />
            )}
            {isDeleteModalOpen && eventToDelete && (
                <DeleteModal 
                    task={eventToDelete} 
                    onClose={() => setIsDeleteModalOpen(false)} 
                    onConfirm={confirmDelete} 
                />
            )}
        </div>
    );
};

export default EventPage;
