import { useDispatch, useSelector } from 'react-redux'
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store';
import { calendarApi } from '../api';
import { convertEventsToDateEvents } from '../helpers';

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events,activeEvent } = useSelector( state => state.calendar);
    const { user } = useSelector( state => state.auth);

    const setActiveEvent = ( calendarEvent ) => {;
       dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async( calendarEvent ) => {
        // TODO: llegar al backend

        // Todo bien
        if ( calendarEvent._id) {
            // Actualizamos
            dispatch( onUpdateEvent({...calendarEvent}))
        } else {
            // Creamos
            const { data } = await calendarApi.post('/events',calendarEvent)
            console.log(data)
            dispatch(onAddNewEvent({...calendarEvent, id: data.evento.id, user }))
        }
    }

    const startDeletingEvent = () => {;
       dispatch(onDeleteEvent())
    }

    const startLoadingEvents = async () => {
        try {
            
            const {data} = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(data.eventos);
            dispatch(onLoadEvents(events));
            // console.log(events)

        } catch (error) {
            console.log('Error cargando eventos')
            console.log(error)
        }
    }

    return {
        //*Propiedades
        events,
        activeEvent,
        // Devolvemos el hasEventSelected como bandera para mostrar o no el btn eliminar
        hasEventSelected: !!activeEvent, 

        //*Métodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents,


    }
}
