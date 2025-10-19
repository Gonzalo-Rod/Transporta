import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const SearchLocation = ({ placeholder, onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async (text) => {
    setQuery(text);

    if (text.length < 3) {
      setSuggestions([]);
      return; // No buscar si el texto tiene menos de 3 caracteres
    }

    try {
      const response = await fetch(
        `https://proyecto-is-google-api.vercel.app/google-maps/search?query=${encodeURIComponent(
          text
        )}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        setSuggestions(data.results);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSuggestions([]);
    }
  };

  const handleSelect = (location) => {
    setQuery(location.name);
    setSuggestions([]);
    setIsFocused(false);
    onLocationSelect(location.name);
  };

  return (
    <View style={[styles.container, isFocused && { zIndex: 10 }]}>
      <View style={styles.inputRow}>
        <Ionicons name="search" size={18} color="#A5A5A5" />
        <TextInput
          testID="search-input"
          placeholder={placeholder || 'Buscar ubicación'}
          style={styles.input}
          value={query}
          onChangeText={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {suggestions.length > 0 && query.length > 0 && ( // Mostrar solo si hay sugerencias y texto
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                testID={`suggestion-${item.place_id}`}
                onPress={() => handleSelect(item)}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionText}>{item.name}</Text>
                <Text style={styles.suggestionSubText}>
                  {item.formatted_address}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.flatList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    position: 'relative',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
  },
  input: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60, // Ajusta según la altura de tu inputRow
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    zIndex: 10,
    maxHeight: 200, // Altura máxima para la lista
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, // Desplaza la sombra hacia abajo
    shadowOpacity: 4, // Más sutil para el efecto de levitación
    shadowRadius: 10, // Sombra más difusa
    elevation: 10, // Para Android
  },
  flatList: {
    flexGrow: 0, // Evita que la lista ocupe más espacio del necesario
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  suggestionSubText: {
    fontSize: 14,
    color: '#A5A5A5',
    marginTop: 3,
  },
});

export default SearchLocation;

SearchLocation.propTypes = {
  placeholder: PropTypes.string,
  onLocationSelect: PropTypes.func.isRequired,
};

SearchLocation.defaultProps = {
  placeholder: 'Buscar ubicación',
};
