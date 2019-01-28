import React, {
  createContext,
  Component
} from "react";

export const LanguageContext = createContext({});

class LanguageProvider extends Component {
  state = {
    user: null,
  };

  switchLanguage(lang) {
    this.setState({lang})
  }

  render() {
    return (
      <LanguageContext.Provider
        value={{
          lang : this.state.lang,
          switchLanguage : this.switchLanguage.bind(this)}}>
        {this.props.children}
      </LanguageContext.Provider>
    );
  }
}

export default LanguageProvider;