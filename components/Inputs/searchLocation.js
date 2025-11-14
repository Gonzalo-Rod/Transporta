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
              text,
          )}`,
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

const COLORS = {
  textPrimary: '#333333',
  inputBackground: '#F4F4F4',
  border: '#E0E0E0',
  textSecondary: '#A5A5A5',
  white: '#FFFFFF',
  black: '#000000',
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    position: 'relative',
  },
  flatList: {
    flexGrow: 0, // Evita que la lista ocupe más espacio del necesario
  },
  input: {
    color: COLORS.textPrimary,
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  suggestionItem: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  suggestionSubText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 3,
  },
  suggestionText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  suggestionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 10, // Para Android
    left: 0,
    maxHeight: 200, // Altura máxima para la lista
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 }, // Desplaza la sombra hacia abajo
    shadowOpacity: 4, // Más sutil para el efecto de levitación
    shadowRadius: 10, // Sombra más difusa
    top: 60, // Ajusta según la altura de tu inputRow
    zIndex: 10,
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
