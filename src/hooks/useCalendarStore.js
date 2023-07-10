import { useDispatch, useSelector } from 'react-redux'
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store';
import { calendarApi } from '../api';

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


    }
}
