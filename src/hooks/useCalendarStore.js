import { useDispatch, useSelector } from 'react-redux'
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store';

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events,activeEvent } = useSelector( state => state.calendar);

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
            dispatch(onAddNewEvent({...calendarEvent,_id: new Date().getTime()}))
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
