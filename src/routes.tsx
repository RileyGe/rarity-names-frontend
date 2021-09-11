import { Route, Switch } from 'react-router-dom'
import Home from './pages/Home'

function Routes(): JSX.Element {
    return (
        <Switch>
            <Route exact strict path="/" component={Home} />
        </Switch>
    )
}

export default Routes
